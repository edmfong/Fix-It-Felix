class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    create() {
        // set variables
        playerDirection = 'left';
        playerMovement = 'idle';
        isSuper = true;
        immune = true;
        fixOnCD = false;
        fixing = false;
        fixed = false;
        pieExists = false;
        ralphLocation = 2;
        gameOver = false;
        nextLevel = false;
        transitioning = false;
        this.ralphFirstMove = true;
        score = 0;

        // temp gameover reset
        if (lives == 0) {
            lives = 3;
            level = 1
        }

        // initialize building
        if (level == 1) {
        this.buildings = this.add.tileSprite(centerX, centerY, 128, 128, 'buildings', 0).setScale(5);
        }
        else {
            this.buildings = this.add.tileSprite(centerX, centerY, 128, 128, 'buildings', 1).setScale(5);
        }

        // Create a graphics object
        this.statsBar = this.add.graphics();

        // Draw a black rectangle at the top of the screen
        this.blackBar = this.statsBar.fillStyle(0x000000, 1);
        this.blackBar.fillRect(0, 0, game.config.width, 70);
        this.blackBar.setDepth(90);

        // Display player lives, score, highscore (temp)
        this.scoreString = String(score).padStart(6, '0');
        this.highscoreString = String(highscore).padStart(6, '0');

        this.livesText = this.add.bitmapText(width - width/10, 10, 'pixelFont', 'Lives', 18).setScrollFactor(0).setOrigin(0.5, 0).setTintFill(0xffffff).setDepth(91);
        this.livesDisplay = this.add.bitmapText(width - width/10, 40, 'pixelFont', lives, 18).setScrollFactor(0).setOrigin(0.5, 0).setTintFill(0xffffff).setDepth(91);
        this.scoreText = this.add.bitmapText(width/10, 10, 'pixelFont', 'Score', 18).setScrollFactor(0).setOrigin(0.5, 0).setTintFill(0xff0000).setDepth(91);
        this.scoreDisplay = this.add.bitmapText(width/10, 40, 'pixelFont', this.scoreString, 18).setScrollFactor(0).setOrigin(0.5, 0).setTintFill(0xffffff).setDepth(91);
        this.highScoreText = this.add.bitmapText(width/2, 10, 'pixelFont', 'High Score', 18).setScrollFactor(0).setOrigin(0.5, 0).setTintFill(0xff0000).setDepth(91);
        this.highScoreDisplay = this.add.bitmapText(width/2, 40, 'pixelFont', this.highscoreString, 18).setScrollFactor(0).setOrigin(0.5, 0).setTintFill(0xffffff).setDepth(91);

        // initalize felix
        if (level == 1) {
            this.felix = this.physics.add.sprite(width / 2, height / 1, 'Felix', 0).setScale(2).setDepth(10).setOrigin(0.5, 1);
        }
        else {
            this.felix = this.physics.add.sprite(width / 2, height / 1.1, 'Felix', 0).setScale(2).setDepth(10).setOrigin(0.5, 1);
        }
        this.felix.setGravityY(1000);
        this.felix.setSize(4, 24).setOffset(14, 8);
        this.felix.body.setCollideWorldBounds(true);
        this.felix.setBounce(0).setFriction(0);
        this.felix.play('felix_idle_left');
        if (level == 1) {
            this.physics.world.setBounds(0, 0, width, height, true, true, true, true)
        }
        else {
            this.physics.world.setBounds(0, 0, width, height, true, true, true, false)
        }
        

        // initalize ralph
        this.ralph = this.physics.add.sprite(width / 2, height / 2.9, 'Ralph', 0).setScale(4).setDepth(10).setOrigin(0.5, 1);
        this.ralph.play('ralph_idle');

        // hat
        this.hat = this.physics.add.sprite(this.felix.x, this.felix.y, 'hat', 0).setScale(2).setDepth(11).setOrigin(0.5, 1).setAlpha(0);
        this.hat.setSize(16, 4).setOffset(8, 8)

        // pie
        this.pie = this.physics.add.sprite(0, 0, 'misc', 0).setScale(3.5).setDepth(11).setOrigin(0.5, 0).setAlpha(0);
        this.pie.setImmovable();

        // brick
        this.brick = this.physics.add.sprite(0, 0, 'misc', 1).setScale(4).setDepth(80).setOrigin(0.5, 0).setAlpha(0);
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

        // initialize flowerpot obstacles
        this.flowerpotGroup = this.add.group({
            runChildUpdate: true
        });

        // initialize window cover obstacles
        this.windowcoverGroup = this.add.group({
            runChildUpdate: true
        });

        this.setPlatform();
        this.setWindow();
        if (level > 1) {
            this.setObstacles();
        }
        
        // coliders
        this.physics.add.collider(this.felix, this.platformGroup);
        this.physics.add.collider(this.felix, this.windowcoverGroup, function () {
        this.hat.setVelocity(this.felix.body.velocity.x, this.felix.body.velocity.y);
            this.hat.x = this.felix.x;
            this.hat.y = this.felix.y;
        }, null, this);
        this.physics.add.collider(this.felix, this.flowerpotGroup);
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

            //debug keys
            pKey: Phaser.Input.Keyboard.KeyCodes.P,
            oKey: Phaser.Input.Keyboard.KeyCodes.O,
        })

        // initialize sfx
        this.fixSFX = this.sound.add('fix');
        this.punchSFX = this.sound.add('punch');
        this.jumpSFX = this.sound.add('jump');
        this.eatSFX = this.sound.add('eat');
        this.clickSFX = this.sound.add('click');
        this.hitSFX = this.sound.add('hit');
    }

    update() {
        if (!gameOver && !nextLevel) {
            // lives display
            this.livesDisplay.setText(lives);

            // score display
            this.scoreString = String(score).padStart(6, '0');
            this.scoreDisplay.setText(this.scoreString);

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
                this.jumpSFX.play()
                this.felix.setVelocityY(-200);
            }
            
            if(cursors.up.isDown && this.felix.body.onFloor() && (this.felix.y >= game.config.height - this.felix.height / 2) && fixing == false) { // jumping on 1st level on ground
                this.jumpSFX.play()
                this.felix.setVelocityY(-375);
            }
            else if(cursors.up.isDown && this.felix.body.onFloor() && (this.felix.y > height/1.8) && !(cursors.left.isDown || cursors.right.isDown) && fixing == false) { // jumping only
                this.jumpSFX.play()
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
                this.hat.setAlpha(1);
            }

            // fell down
            if (this.felix.y > height + this.felix.height) {
                this.felix.x = width / 2
                this.felix.y = height / 1.1;
                immune = true;
                this.immuneCondition();
                lives--;
                this.time.delayedCall(2000, () => {
                    immune = false;
                    this.immuneCondition();
                });
            }
        }

        // hat
        if (!(this.felix.body.blocked.left || this.felix.body.blocked.right)) {
            this.hat.x = this.felix.x;
            this.hat.y = this.felix.y;

            this.hat.setVelocity(this.felix.body.velocity.x, this.felix.body.velocity.y);
        }

        if (gameOver) {
            this.felix.setVelocityX(0);
            this.felix.setVelocityY(0);
            this.felix.setGravityY(0);
            this.felix.play('felix' + '_' + 'idle' + '_' + playerDirection, true);
            this.hat.setAlpha(0);
            
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
        
            if (score > highscore) {
                highscore = score;
                this.highScoreString = String(highscore).padStart(6, '0');
                this.highScoreDisplay.setText(this.highScoreString);
            }
        }

        if (nextLevel && !transitioning) {
            console.log('nextlevel')
            transitioning = true;
            this.felix.setVelocityX(0);
            this.felix.setVelocityY(0);
            this.felix.setGravityY(0);
            this.felix.play('felix' + '_' + 'idle' + '_' + playerDirection, true);
            this.hat.setAlpha(0);

            // next level
            level++;
            console.log(level);

            if (level == 5) {
                this.scene.start('endScene');
            }

            else {
                this.superCheckTimer.remove();
                this.pieTimer.remove();
                this.ralphAttack.remove();

                this.felix.play('felix' + '_' + 'fix' + '_' + playerDirection, true);
                this.ralph.play('ralph_idle');
                this.time.delayedCall(1000, () => {
                    this.tweens.add({
                        targets: this.ralph,
                        y: '-=50',
                        duration: 300,
                        yoyo: true,
                        repeat: 2,
                        onComplete: () => {
                            this.time.delayedCall(1000, () => {
                                this.tweens.add({
                                    targets: this.ralph,
                                    y: 0,
                                    duration: 1000,
                                    ease: 'Power2',
                                    onComplete: () => {
                                        this.tweens.add({
                                            targets: this.felix,
                                            ease: 'Power2',
                                            y: 0,
                                            duration: 1000,
                                            onComplete: () => {
                                                this.time.delayedCall(500, () => {
                                                    this.scene.start('playScene');
                                                });
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    });
                });
            }

            

            // // Create a graphics object
            // this.overBar = this.add.graphics();

            // // Draw a black rectangle at the top of the screen
            // this.whiteBar2 = this.overBar.fillStyle(0xffffff, 1);
            // this.whiteBar2.fillRect((width/4) - 5, height/2 - 5, (width/2) + 10, height/12 + 10);
            // this.blackBar2 = this.overBar.fillStyle(0x00000, 1);
            // this.blackBar2.fillRect(width/4, height/2, width/2, height/12);
            
            // this.whiteBar2.setDepth(12);
            // this.blackBar2.setDepth(13);
            // this.nextLevelText = this.add.text(width/2, height/2, 'Next Level Incomplete\nPress [R] to Restart', { fontSize: '24px', fill: '#fff', fontWeight: 'bold', align: 'center' }).setScrollFactor(0).setOrigin(0.5, 0).setDepth(14);
            
            // if (score > highscore) {
            //     highscore = score;
            //     this.highScoreString = String(highscore).padStart(6, '0');
            //     this.highScoreDisplay.setText(this.highScoreString);
            // }
        }

        if (transitioning) {
            this.brick.x = 0;
            this.brick.y = 0;
        }

        if ((gameOver || nextLevel) && cursors.rKey.isDown) {
            this.clickSFX.play()
            this.scene.restart();
        }

    }

    setPlatform() {
        // col 1
        this.addPlatform(width/2 - width/3.77, height/2.15);
        this.addPlatform(width/2 - width/3.77, height/1.53);
        this.addPlatform(width/2 - width/3.77, height/1.19);

        // col 2
        this.addPlatform(width/2 - width/7.5, height/2.15);
        this.addPlatform(width/2 - width/7.5, height/1.53);
        this.addPlatform(width/2 - width/7.5, height/1.19);
        
        // col 3
        this.addPlatform(width/2, height/2.15);
        this.addPlatform(width/2, height/1.53);
        if (level != 1) {
            this.addPlatform(width/2, height/1.19);
        }

        // col 4
        this.addPlatform(width/2 + width/7.5, height/2.15);
        this.addPlatform(width/2 + width/7.5, height/1.53);
        this.addPlatform(width/2 + width/7.5, height/1.19);

        // col 5
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
        // col 1
        this.addWindow(width/2 - width/3.77, height/2.415);
        this.addWindow(width/2 - width/3.77, height/1.662);
        this.addWindow(width/2 - width/3.77, height/1.267);

        // col 2
        this.addWindow(width/2 - width/7.5, height/2.415);
        this.addWindow(width/2 - width/7.5, height/1.662);
        this.addWindow(width/2 - width/7.5, height/1.267);

        // col 3
        this.addWindow(width/2, height/2.415);
        if (level != 1) {
            this.addWindow(width/2, height/1.662);
            this.addWindow(width/2, height/1.267);
        }

        // col 4
        this.addWindow(width/2 + width/7.5, height/2.415);
        this.addWindow(width/2 + width/7.5, height/1.662);
        this.addWindow(width/2 + width/7.5, height/1.267);

        // col 5
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

    breakWindow() {
        this.windowGroup.getChildren().forEach(window => {
            this.rand = Phaser.Math.Between(1, (70 - level*10));
            if (this.rand == 1) {
                if (window.frame.name > 0) {
                    window.setTexture(window.texture, window.frame.name - 1);
                }
            }
        });

    }

    windowFixable(felix, window) {
        if (fixing == true) {
            if (isSuper) {
                if (window.frame.name < 4 && fixed == false) {
                    this.fixSFX.play()
                    this.initialFrame = window.frame.name;
                    window.setTexture(window.texture, 4);
                    fixed = true;
                    if ((4 - this.initialFrame) == 0) {
                        score += 4 * 100;
                    }
                    else {
                        score += (4 - this.initialFrame) * 100;
                    }
                }
            }
            else if (window.frame.name < 4 && fixed == false) {
                this.fixSFX.play()
                window.setTexture(window.texture, window.frame.name + 1);
                fixed = true;
                score += 100;
            }
        }
    }

    pieAte() {
        this.pie.setAlpha(0);
        this.pie.x = 0;
        this.pie.y = 0;
        isSuper = true;
        this.eatSFX.play()
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
                this.hat.setAlpha(0);
            }
        }
        else {
            this.hat.clearTint();
        }
    }

    immuneCondition() {
        if (!gameOver && !nextLevel) {
            this.immuneEvent;
            if (immune) {
                this.immuneEvent = this.time.addEvent({
                    delay: 200,
                    callback: function () {
                        this.felix.alpha = (this.felix.alpha === 0) ? 1 : 0;
                    },
                    callbackScope: this,
                    loop: true,
                });
            }
            else {
                this.immuneEvent.remove();
                this.felix.alpha = 1;
            }
        }
        else {
            this.felix.setAlpha(1);
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
            if (!immune) {
                this.hitSFX.play()
                if (!isSuper) {
                    immune = true;
                    this.immuneCondition();
                    lives--;
                    this.time.delayedCall(2000, () => {
                        immune = false;
                        this.immuneCondition();
                    });
                }
                // reset brick
                this.brick.setAlpha(0);
                this.brick.setVelocityY(0);
                this.brick.x = 0;
                this.brick.y = 0;
            }
        }
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
                this.ralphAttack = this.tweens.add({
                    targets: this.ralph,
                    x: width/2,
                    duration: 500 * this.travel,
                    onComplete: () => {
                        this.breakWindow()
                        this.punchMult()
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
                this.ralphAttack = this.tweens.add({
                    targets: this.ralph,
                    x: width/2 + width/(this.xPos[this.randX]),
                    duration: 500 * this.travel,
                    onComplete: () => {
                        this.breakWindow()
                        this.punchMult()
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

    punchMult() {
        this.punchSFX.play()
        this.time.delayedCall(250, () => {
            this.punchSFX.play()
        });
        this.time.delayedCall(500, () => {
            this.punchSFX.play()
        });
        this.time.delayedCall(750, () => {
            this.punchSFX.play()
        });
        this.time.delayedCall(1000, () => {
            this.punchSFX.play()
        });
        this.time.delayedCall(1250, () => {
            this.punchSFX.play()
        });
    }

    setObstacles() {
        this.rand = Phaser.Math.Between(0, 1);
        if (this.rand == 0) {
            // col 1
            this.addObstacle(width/2 - width/3.77, 1);
            this.addObstacle(width/2 - width/3.77, 3);

            // col 2
            this.addObstacle(width/2 - width/7.5, 2);
            
            // col 3
            this.addObstacle(width/2, 1);
            this.addObstacle(width/2, 3);

            // col 4
            this.addObstacle(width/2 + width/7.5, 2);

            // col 5
            this.addObstacle(width/2 + width/3.77, 1);
            this.addObstacle(width/2 + width/3.77, 3);
        }
        else {
            // col 1
            this.addObstacle(width/2 - width/3.77, 2);

            // col 2
            this.addObstacle(width/2 - width/7.5, 1);
            this.addObstacle(width/2 - width/7.5, 3);
            
            // col 3
            this.addObstacle(width/2, 2);

            // col 4
            this.addObstacle(width/2 + width/7.5, 1);
            this.addObstacle(width/2 + width/7.5, 3);

            // col 5
            this.addObstacle(width/2 + width/3.77, 2);
        }
    }

    addObstacle(x, y) {
        this.flowerpotY = [2.125, 1.52, 1.182]
        this.windowcoverY = [2.245, 1.58, 1.22]

        // 33.3% to spawn an obstacle
        this.randSpawn = Phaser.Math.Between(1, 3);
        if (this.randSpawn == 1) {
            this.rand = Phaser.Math.Between(0, 1);
            if (this.rand == 0) {
                let windowcover = new WindowCovers(this, x, height/this.windowcoverY[y-1], 'obstacle', 0);
                windowcover.setSize(3, 16).setOffset(0, 0).setScale(5).setOrigin(0.5, 0).setDepth(12);
                windowcover.body.checkCollision.up = false;
                windowcover.body.checkCollision.down = false;
                this.windowcoverGroup.add(windowcover);  
                let windowcover2 = new WindowCovers(this, x, height/this.windowcoverY[y-1], 'obstacle', 1);
                windowcover2.setSize(3, 16).setOffset(13, 0).setScale(5).setOrigin(0.5, 0);
                windowcover2.body.checkCollision.up = false;
                windowcover2.body.checkCollision.down = false;
                this.windowcoverGroup.add(windowcover2);
            }
            else {
                let flowerpot = new Flowerpot(this, x, height/this.flowerpotY[y-1], 'obstacle');
                flowerpot.setSize(15, 3).setOffset(0.5, 12).setScale(4).setOrigin(0.5, 0).setDepth(12);
                flowerpot.body.checkCollision.left = false;
                flowerpot.body.checkCollision.right = false;
                this.flowerpotGroup.add(flowerpot);  
            }
        }
    }
}