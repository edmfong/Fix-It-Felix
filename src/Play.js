class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    create() {
        // initialize building
        this.buildings = this.add.tileSprite(centerX, centerY, 128, 128, 'buildings', 1).setScale(5);

        // initalize player
        this.felix = this.physics.add.sprite(width / 2, height / 3, 'Felix', 0).setScale(2).setDepth(10);
        this.felix.setGravityY(1000);
        this.felix.body.setCollideWorldBounds(true);
        this.felix.setSize(4, 24).setOffset(14, 8)
        this.felix.play('felix_idle_left');

        // hat
        this.hat = this.physics.add.sprite(this.felix.x, this.felix.y, 'hat', 0).setScale(2).setDepth(11);
        this.hat.setSize(16, 4).setOffset(8, 8)

        // change colors
        this.superCheckTimer = this.time.addEvent({
            delay: 200,
            callback: this.superCondition,
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
        this.physics.add.overlap(this.felix, this.windowGroup, this.windowFixable, null, this);

        // initialize controls
        cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            dKey: Phaser.Input.Keyboard.KeyCodes.D, // debugging
        })

    }

    update() {
        // hat
        this.hat.x = this.felix.x;
        this.hat.y = this.felix.y;

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
        
        if(cursors.up.isDown && this.felix.body.onFloor() && (this.felix.y > height/1.1) && fixing == false) { // jumping on 1st level on ground
            this.felix.setVelocityY(-375);
        }
        else if(cursors.up.isDown && this.felix.body.onFloor() && (this.felix.y > height/2) && !(cursors.left.isDown || cursors.right.isDown) && fixing == false) { // jumping only
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

        // debugging
        if (cursors.dKey.isDown) {
            isSuper = true;
        }
        else {
            isSuper = false;
        }

        // every window is fixed
        if (this.windowGroup.getChildren().every(window => window.frame.name == 4)) {
            //console.log('yippe');
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
        this.addPlatform(width/2, height/1.19);

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
        platform.setSize(15, 4).setOffset(0.5, 13).setScale(4).setOrigin(0.5, 0).setAlpha(0);
        platform.body.checkCollision.down = false;
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
        this.addWindow(width/2, height/1.662);
        this.addWindow(width/2, height/1.267);

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
        this.randFrame = Phaser.Math.Between(0, 4);
        let window = new Window(this, x, y, texture, this.randFrame);
        window.setSize(6, 9).setOffset(5, 7).setScale(5).setOrigin(0.5, 0).setAlpha(1);
        this.windowGroup.add(window);     
    }

    windowFixable(felix, window) {
        if (fixing == true) {
            if (window.frame.name < 4 && fixed == false) {
                window.setTexture(window.texture, window.frame.name + 1);
                fixed = true;
            }
        }
    }

    superCondition() {
        if (isSuper) {
            const color = Phaser.Display.Color.RandomRGB();
            this.hat.setTint(color.color);
        }
        else {
            this.hat.clearTint();
        }
    }
}