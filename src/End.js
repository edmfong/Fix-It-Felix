class End extends Phaser.Scene {
    constructor() {
        super('endScene');
    }

    create() {
        this.buildings = this.add.tileSprite(centerX, centerY*1.3, 128, 128, 'buildings', 2).setScale(5);
        this.felix = this.add.sprite(width / 3, height / 2.2, 'Felix', 0).setScale(2).setDepth(10).setOrigin(0.5, 1);
        this.ralph = this.add.sprite(width / 1.3, height / 2.2, 'Ralph', 0).setScale(4).setDepth(10).setOrigin(0.5, 1);

        this.npcGroup = this.add.group();
        this.createNPC(this, width/4.25, height/2.33, 'npc', 6, this.npcGroup);
        this.createNPC(this, width/4.25, height/2.33, 'npc', 7, this.npcGroup);
        this.createNPC(this, width/4.25, height/2.33, 'npc', 8, this.npcGroup);
        this.createNPC(this, width/4.25, height/2.33, 'npc', 9, this.npcGroup);
        this.createNPC(this, width/4.25, height/2.33, 'npc', 10, this.npcGroup);
        this.createNPC(this, width/4.25, height/2.33, 'npc', 11, this.npcGroup);

        this.npcWalkMid(() => {
            this.npcJump()
        });
        // onComplete: () => {
        //     this.npcGroup.getChildren().forEach(npc => {
        //         npc.setTexture(npc.texture, npc.frame.name - 6);
        //     });
        // }
    }

    createNPC(scene, x, y, texture, frame, group) {
        this.npc = scene.add.sprite(x, y, texture, frame).setScale(2);
        group.add(this.npc);
      }

    npcWalkMid(callback) {
        this.time.delayedCall(1000, () => {
            this.tweens.add({
                targets: this.npcGroup.getChildren()[5],
                x: width/2.9 + 6 * 30,
                duration: 3 * ((width/2.9 + 6 * 30)),
            });
            this.time.delayedCall(300, () => {
                this.tweens.add({
                    targets: this.npcGroup.getChildren()[4],
                    x: width/2.9 + 5 * 30,
                    duration: 3 * ((width/2.9 + 5 * 30)),
                });
            });
            this.time.delayedCall(600, () => {
                this.tweens.add({
                    targets: this.npcGroup.getChildren()[3],
                    x: width/2.9 + 4 * 30,
                    duration: 3 * ((width/2.9 + 4 * 30)),
                });
            });
            this.time.delayedCall(900, () => {
                this.tweens.add({
                    targets: this.npcGroup.getChildren()[2],
                    x: width/2.9 + 3 * 30,
                    duration: 3 * ((width/2.9 + 3 * 30)),
                });
            });
            this.time.delayedCall(1200, () => {
                this.tweens.add({
                    targets: this.npcGroup.getChildren()[1],
                    x: width/2.9 + 2 * 30,
                    duration: 3 * ((width/2.9 + 2 * 30)),
                });
            });
            this.time.delayedCall(1500, () => {
                this.tweens.add({
                    targets: this.npcGroup.getChildren()[0],
                    x: width/2.9 + 1 * 30,
                    duration: 3 * ((width/2.9 + 1 * 30)),
                    onComplete: () => {
                        callback();
                    }
                });
            });
        });
    }

    npcJump() {
        console.log('test')
    }
}