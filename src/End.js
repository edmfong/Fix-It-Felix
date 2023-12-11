class End extends Phaser.Scene {
    constructor() {
        super('endScene');
    }

    create() {
        this.buildings = this.add.tileSprite(centerX, centerY, 128, 128, 'buildings', 2).setScale(5);
    }

    update() {
    }
}