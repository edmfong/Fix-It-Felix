class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    create() {
        // set variables
        playerDirection = 'left';
        playerMovement = 'idle';
        isSuper = false;
        fixOnCD = false;
        fixing = false;
        fixed = false;
        pieExists = false;
        ralphLocation = 2;
        gameOver = false;
        nextLevel = false;
        this.ralphFirstMove = true;

        if (lives == 0) {
            lives = 3;
        }

        // initialize building
        this.buildings = this.add.tileSprite(centerX, centerY, 128, 128, 'buildings', 0).setScale(5);

        // Create a graphics object
        this.statsBar = this.add.graphics();

        // Draw a black rectangle at the top of the screen
        this.blackBar = this.statsBar.fillStyle(0x000000, 1);
        this.blackBar.fillRect(0, 0, game.config.width, 70);

        // Display player lives, score, highscore (temp)
        this.livesText = this.add.text(width - width/10, 10, 'Lives:', { fontSize: '24px', fill: '#fff' }).setScrollFactor(0).setOrigin(0.5, 0);
        this.livesDisplay = this.add.text(width - width/10, 40, lives, { fontSize: '24px', fill: '#fff' }).setScrollFactor(0).setOrigin(0.5, 0);
        this.scoreText = this.add.text(width/10, 10, 'Score: 0', { fontSize: '24px', fill: '#fff' }).setScrollFactor(0).setOrigin(0.5, 0);
        this.highScoreText = this.add.text(width/2, 10, 'High Score: 0', { fontSize: '24px', fill: '#fff' }).setScrollFactor(0).setOrigin(0.5, 0);

        // initalize felix
        this.felix = this.physics.add.sprite(width / 2, height / 1.81, 'Felix', 0).setScale(2).setDepth(10).setOrigin(0.5, 1);
        this.felix.setGravityY(1000);
        this.felix.body.setCollideWorldBounds(true);
        this.felix.setSize(4, 24).setOffset(14, 8);
        this.felix.setBounce(0).setFriction(0);
        this.felix.play('felix_idle_left');

        // initalize ralph
        this.ralph = this.physics.add.sprite(width / 2, height / 2.9, 'Ralph', 0).setScale(4).setDepth(10).setOrigin(0.5, 1);
        this.ralph.play('ralph_idle');

        // hat
        this.hat = this.physics.add.sprite(this.felix.x, this.felix.y, 'hat', 0).setScale(2).setDepth(11).setOrigin(0.5, 1);
        this.hat.setSize(16, 4).setOffset(8, 8)

        // pie
        this.pie = this.physics.add.sprite(0, 0, 'misc', 0).setScale(3.5).setDepth(11).setOrigin(0.5, 0).setAlpha(0);
        this.pie.setImmovable();

        // brick
        this.brick = this.physics.add.sprite(0, 0, 'misc', 1).setScale(4).setDepth(10).setOrigin(0.5, 0).setAlpha(0);
        this.brick.setImmovable();

        // change colors
        this.superCheckTimer = this.time.addEvent({
            delay: 200,
            callback: this.superCondition,
            callbackScope: this,
            loop: true
        });

        // spawn pie
        this.pieTimer = this.time.addEvent({
            delay: 5000,
            callback: this.spawnPie,
            callbackScope: this,
            loop: true
        });

        // move ralph and attack
        this.ralphMove();
        this.ralphAttack = this.time.addEvent({
            delay: 4000,
            callback: this.ralphMove,
            callbackScope: this,
            loop: true
        });

        // initialize platform obstacles
        this.platformGroup = this.add.group({
            runChildUpdate: true
        });

        // initialize window obstacles
        this.windowGroup = this.add.group({
            runChildUpdate: true
        });

        this.setPlatform();
        this.setWindow();

        // coliders
        this.physics.add.collider(this.felix, this.platformGroup);
        this.physics.add.overlap(this.hat, this.brick, this.felixHit, null, this);
        this.physics.add.overlap(this.felix, this.pie, this.pieAte, null, this);
        this.physics.add.overlap(this.felix, this.windowGroup, this.windowFixable, null, this);

        // initialize controls
        cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            rKey: Phaser.Input.Keyboard.KeyCodes.R,
        })

    }

    update() {
        if (!gameOver && !nextLevel) {
            // lives display
            this.livesDisplay.setText(lives);

            // controls
            if(cursors.left.isDown && fixing == false) {
                this.felix.setVelocityX(-speed)
                playerMovement = 'walk';
                playerDirection = 'left';
            }
            else if(cursors.right.isDown && fixing == false) {
                this.felix.setVelocityX(speed)
                playerMovement = 'walk';
                playerDirection = 'right';
            }
            else if (fixing == false) {
                playerMovement = 'idle';
                this.felix.setVelocityX(0)
            }

            if (cursors.up.isDown && this.felix.body.onFloor() && fixing == false) { // jumping with directions
                this.felix.setVelocityY(-200);
            }
            
            if(cursors.up.isDown && this.felix.body.onFloor() && (this.felix.y >= game.config.height - this.felix.height / 2) && fixing == false) { // jumping on 1st level on ground
                this.felix.setVelocityY(-375);
            }
            else if(cursors.up.isDown && this.felix.body.onFloor() && (this.felix.y > height/1.8) && !(cursors.left.isDown || cursors.right.isDown) && fixing == false) { // jumping only
                this.felix.setVelocityY(-500);
            }
            else if(cursors.down.isDown && this.felix.body.onFloor() && !(cursors.left.isDown || cursors.right.isDown) && fixing == false) {
                this.platformGroup.children.iterate(function(platform) {
                    platform.body.checkCollision.up = false;
                });
                this.time.delayedCall(100, () => {
                    this.platformGroup.children.iterate(function(platform) {
                        platform.body.checkCollision.up = true;
                    });
                });
            }

            if (cursors.space.isDown && !this.prevSpaceDown && fixOnCD == false && this.felix.body.onFloor()) {
                fixOnCD = true;
                fixing = true;
                this.felix.setVelocityX(0)
                if (playerDirection == 'right'){
                    playerMovement = 'fix';
                }
                else if (playerDirection = 'left'){
                    playerMovement = 'fix';
                }
                this.time.delayedCall(400, () => {
                    fixOnCD = false;
                    fixing = false;
                    fixed = false;
                });
            }

            // change animations
            this.felix.play('felix' + '_' + playerMovement + '_' + playerDirection, true);
            this.hat.play('hat' + '_' + playerMovement + '_' + playerDirection, true);

            // every window is fixed
            if (this.windowGroup.getChildren().every(window => window.frame.name == 4)) {
                nextLevel = true;
            }

            // no lives
            if (lives == 0) {
                gameOver = true;
            }

            // destroy bricks out of screen
            if (this.brick.y > game.config.height || this.brick.y < 0) {
                this.brick.setAlpha(0);
                this.brick.setVelocityY(0);
                this.brick.x = 0;
                this.brick.y = 0;
            }

            // change hat color
            if (isSuper) {
                this.superCondition();
            }
        }

        // hat
        this.hat.x = this.felix.x;
        this.hat.y = this.felix.y;
        this.hat.setVelocity(this.felix.body.velocity.x, this.felix.body.velocity.y);

        if (gameOver) {
            // Create a graphics object
            this.overBar = this.add.graphics();

            // Draw a black rectangle at the top of the screen
            this.whiteBar2 = this.overBar.fillStyle(0xffffff, 1);
            this.whiteBar2.fillRect((width/4) - 5, height/2 - 5, (width/2) + 10, height/12 + 10);
            this.blackBar2 = this.overBar.fillStyle(0x00000, 1);
            this.blackBar2.fillRect(width/4, height/2, width/2, height/12);
            
            this.whiteBar2.setDepth(12);
            this.blackBar2.setDepth(13);
            this.gameOverText = this.add.text(width/2, height/2, 'Game Over\nPress [R] to Restart', { fontSize: '24px', fill: '#fff', fontWeight: 'bold', align: 'center' }).setScrollFactor(0).setOrigin(0.5, 0).setDepth(14);
        }

        if (nextLevel) {
            // Create a graphics object
            this.overBar = this.add.graphics();

            // Draw a black rectangle at the top of the screen
            this.whiteBar2 = this.overBar.fillStyle(0xffffff, 1);
            this.whiteBar2.fillRect((width/4) - 5, height/2 - 5, (width/2) + 10, height/12 + 10);
            this.blackBar2 = this.overBar.fillStyle(0x00000, 1);
            this.blackBar2.fillRect(width/4, height/2, width/2, height/12);
            
            this.whiteBar2.setDepth(12);
            this.blackBar2.setDepth(13);
            this.nextLevelText = this.add.text(width/2, height/2, 'Next Level Incomplete\nPress [R] to Restart', { fontSize: '24px', fill: '#fff', fontWeight: 'bold', align: 'center' }).setScrollFactor(0).setOrigin(0.5, 0).setDepth(14);
        }

        if ((gameOver || nextLevel) && cursors.rKey.isDown) {
            this.scene.restart();
        }

    }

    setPlatform() {
        // row 1
        this.addPlatform(width/2 - width/3.77, height/2.15);
        this.addPlatform(width/2 - width/3.77, height/1.53);
        this.addPlatform(width/2 - width/3.77, height/1.19);

        // row 2
        this.addPlatform(width/2 - width/7.5, height/2.15);
        this.addPlatform(width/2 - width/7.5, height/1.53);
        this.addPlatform(width/2 - width/7.5, height/1.19);
        
        // row 3
        this.addPlatform(width/2, height/2.15);
        this.addPlatform(width/2, height/1.53);
        if (level != 1) {
            this.addPlatform(width/2, height/1.19);
        }

        // row 4
        this.addPlatform(width/2 + width/7.5, height/2.15);
        this.addPlatform(width/2 + width/7.5, height/1.53);
        this.addPlatform(width/2 + width/7.5, height/1.19);

        // row 5
        this.addPlatform(width/2 + width/3.77, height/2.15);
        this.addPlatform(width/2 + width/3.77, height/1.53);
        this.addPlatform(width/2 + width/3.77, height/1.19);
    }

    addPlatform(x, y) {
        let platform = new Platform(this, x, y, 'obstacle');
        if (level == 1 && x == width/2 && y == height/1.53) {
            platform.setSize(20, 4).setOffset(-2, 13).setScale(4).setOrigin(0.5, 0).setAlpha(0);
        }
        else {
            platform.setSize(15, 4).setOffset(0.5, 13).setScale(4).setOrigin(0.5, 0).setAlpha(0);
        }
        platform.body.checkCollision.down = false;
        platform.body.checkCollision.left = false;
        platform.body.checkCollision.right = false;
        this.platformGroup.add(platform);     
    }

    setWindow() {
        // row 1
        this.addWindow(width/2 - width/3.77, height/2.415);
        this.addWindow(width/2 - width/3.77, height/1.662);
        this.addWindow(width/2 - width/3.77, height/1.267);

        // row 2
        this.addWindow(width/2 - width/7.5, height/2.415);
        this.addWindow(width/2 - width/7.5, height/1.662);
        this.addWindow(width/2 - width/7.5, height/1.267);

        // row 3
        this.addWindow(width/2, height/2.415);
        if (level != 1) {
            this.addWindow(width/2, height/1.662);
            this.addWindow(width/2, height/1.267);
        }

        // row 4
        this.addWindow(width/2 + width/7.5, height/2.415);
        this.addWindow(width/2 + width/7.5, height/1.662);
        this.addWindow(width/2 + width/7.5, height/1.267);

        // row 5
        this.addWindow(width/2 + width/3.77, height/2.415);
        this.addWindow(width/2 + width/3.77, height/1.662);
        this.addWindow(width/2 + width/3.77, height/1.267);
    }

    addWindow(x, y) {
        this.rand = Phaser.Math.Between(0, 1);
        let texture;
        if (this.rand == 0) {
            texture = 'window_1'
        }
        else {
            texture = 'window_2'
        }
        this.randFrame = Phaser.Math.Between(0, 3);
        let window = new Window(this, x, y, texture, this.randFrame);
        window.setSize(6, 9).setOffset(5, 7).setScale(5).setOrigin(0.5, 0).setAlpha(1);
        this.windowGroup.add(window);     
    }

    windowFixable(felix, window) {
        if (fixing == true) {
            if (isSuper) {
                window.setTexture(window.texture, 4);
                fixed = true;
            }
            else if (window.frame.name < 4 && fixed == false) {
                window.setTexture(window.texture, window.frame.name + 1);
                fixed = true;
            }
        }
    }

    pieAte() {
        console.log('pie')
        this.pie.setAlpha(0);
        this.pie.x = 0;
        this.pie.y = 0;
        isSuper = true;
        console.log(isSuper)
        this.time.delayedCall(5000, () => {
            pieExists = false;
            isSuper = false;
        });
    }

    superCondition() {
        if (!gameOver && !nextLevel) {
            if (isSuper) {
                const color = Phaser.Display.Color.RandomRGB();
                this.hat.setTint(color.color);
            }
            else {
                this.hat.clearTint();
            }
        }
        else {
            this.hat.clearTint();
        }
    }

    spawnPie() {
        if (!gameOver && !nextLevel) {
            // 10% to spawn pie every 5s
            this.rand = Phaser.Math.Between(1, 10);
            if (!pieExists && this.rand == 1) {
                pieExists = true;
                this.pie.setAlpha(1);
                this.randX = Phaser.Math.Between(0, 4);
                this.randY = Phaser.Math.Between(0, 2);
                this.xPos = [-3.77, -7.5, 0, 3.77, 7.5];
                this.yPos = [2, 1.45, 1.14]
                if (level == 1) {
                    if (this.randX == 2) {
                        this.randX = 1;
                    }
                }
                if (this.randX == 2) {
                    this.pie.x = width/2;
                }
                else {
                    this.pie.x = width/2 + width/(this.xPos[this.randX]);
                }
                this.pie.y = height/(this.yPos[this.randY]);
            }
        }
    }

    felixHit() {
        if (!gameOver && !nextLevel) {
            if (!isSuper) {
                lives--;
            }
        }
        // reset brick
        this.brick.setAlpha(0);
        this.brick.setVelocityY(0);
        this.brick.x = 0;
        this.brick.y = 0;
    }

    ralphMove() {
        if (!gameOver && !nextLevel) {
            this.randX = Phaser.Math.Between(0, 4);
            this.xPos = [-3.77, -7.5, 0, 3.77, 7.5];
            if (this.ralphFirstMove && this.randX == 2) {
                this.randX = 3;
            }
            this.ralphFirstMove = false
            this.travel = Math.abs((ralphLocation + 1) - (this.randX + 1));
            if (this.travel == 0) {
                this.travel = 1;
            }
            ralphLocation = this.randX;
            if (this.randX == 2) {
                this.ralph.play('ralph_walk');
                this.tweens.add({
                    targets: this.ralph,
                    x: width/2,
                    duration: 500 * this.travel,
                    onComplete: () => {
                        this.time.delayedCall(800, function () {
                            this.randBrick = Phaser.Math.Between(1, 2);
                            this.brick.setTexture('misc', this.randBrick);
                            this.brick.setAlpha(1);
                            this.brick.x = this.ralph.x;
                            this.brick.y = this.ralph.y;
                            this.brick.setVelocityY(200);
                        }, [], this);
                        this.ralph.play('ralph_attack').once('animationcomplete', () => {
                            this.ralph.play('ralph_idle');
                        });
                    }
                });
            }
            else {
                this.ralph.play('ralph_walk');
                this.tweens.add({
                    targets: this.ralph,
                    x: width/2 + width/(this.xPos[this.randX]),
                    duration: 500 * this.travel,
                    onComplete: () => {
                        this.time.delayedCall(1000, function () {
                            this.randBrick = Phaser.Math.Between(1, 2);
                            this.brick.setTexture('misc', this.randBrick);
                            this.brick.setAlpha(1);
                            this.brick.x = this.ralph.x;
                            this.brick.y = this.ralph.y;
                            this.brick.setVelocityY(200);
                        }, [], this);
                        this.ralph.play('ralph_attack').once('animationcomplete', () => {
                            this.ralph.play('ralph_idle');
                        });
                    }
                });
            }
        }
    }
}