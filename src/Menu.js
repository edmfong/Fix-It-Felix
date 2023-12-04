class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    create() {
        this.add.image(0, 0, 'menu').setOrigin(0).setScale(5);
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (this.spaceKey.isDown) {
            this.scene.start('playScene');
        }
    }
}