class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    create() {
        this.add.image(0, 0, 'menu').setOrigin(0).setScale(5);
        this.add.bitmapText(width/2, height - height/10, 'pixelFont', '© TOBIKOMO CO. 1982\nALL RIGHTS RESERVED', 18).setScrollFactor(0).setOrigin(0.5, 0).setTintFill(0xff0000);
        this.start = this.add.bitmapText(width/2, height/1.7, 'pixelFont', 'PRESS [SPACE] TO START', 18).setScrollFactor(0).setOrigin(0.5, 0).setTintFill(0xffffff);
        this.info = this.add.bitmapText(width/2, height/1.7 + 30, 'pixelFont', 'PRESS [I] FOR INSTRUCTIONS', 18).setScrollFactor(0).setOrigin(0.5, 0).setTintFill(0xffffff);
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.iKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);

        this.time.addEvent({
            delay: 1500,
            callback: () => {
                this.start.setText('PRESS [SPACE] TO START');
            },
            callbackScope: this,
            loop: true
        });
        this.time.addEvent({
            delay: 1450,
            callback: () => {
                this.start.setText('');
            },
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: 1500,
            callback: () => {
                this.info.setText('PRESS [I] FOR INSTRUCTIONS');
            },
            callbackScope: this,
            loop: true
        });
        this.time.addEvent({
            delay: 1450,
            callback: () => {
                this.info.setText('');
            },
            callbackScope: this,
            loop: true
        });

        this.clickSFX = this.sound.add('click');
    }

    update() {
        if (this.spaceKey.isDown) {
            this.clickSFX.play();
            this.scene.start('playScene');
        }
        if (this.iKey.isDown) {
            this.clickSFX.play();
            this.scene.start('infoScene');
        }
    }
}