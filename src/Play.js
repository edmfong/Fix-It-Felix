class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    create() {
        // initialize building
        this.buildings = this.add.tileSprite(centerX, centerY, 128, 128, 'buildings', 0).setScale(5);

        // initalize player
        this.felix = this.physics.add.sprite(width / 2, height / 2, 'Felix', 0).setScale(2);
        this.felix.setGravityY(300);
        this.felix.body.setCollideWorldBounds(true);
        this.felix.play('felix_walk_left');

        // initialize platform
        this.platform = this.physics.add.image(width/2, height/2, 'obstacle', 2).setScale(4).setOrigin(0, .5);
        this.platform.setSize(16, 3).setOffset(0, 13);
    }
}