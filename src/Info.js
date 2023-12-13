class Info extends Phaser.Scene {
    constructor() {
        super('infoScene');
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        // loads text and images for pg1 and pg2, but hides pg2 until right arrow is pressed
        this.page = 1;
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // movement text
        this.felix = this.add.sprite(width / 7, height / 5, 'Felix', 0).setScale(2).setDepth(10).setOrigin(0.5, 1);
        this.felix.play('felix_walk_right');
        this.felixText = this.add.bitmapText(width/3.5, height / 7.5, 'pixelFont', 'Arrow Keys to Move\n\nUp to Jump, Down to Go Down', 14).setScrollFactor(0).setOrigin(0, 0).setTintFill(0xffffff).setDepth(91).setLeftAlign();

        // ralph info
        this.ralph = this.add.sprite(width / 7, height / 4 + 1 * height / 5, 'Ralph', 0).setScale(3).setDepth(10).setOrigin(0.5, 1);
        this.ralph.play('ralph_attack');
        this.ralph.on('animationcomplete-ralph_attack', () => {
            this.ralph.play('ralph_attack');
        });
        this.ralphText = this.add.bitmapText(width/3.5, height / 7.5 + 1 * height / 5, 'pixelFont', 'Ralph Will Periodically Attack\n\nCausing Bricks to Fall and\n\nWindows to Break', 14).setScrollFactor(0).setOrigin(0, 0).setTintFill(0xffffff).setDepth(91).setLeftAlign();
        
        // brick text
        this.brick = this.add.sprite(width / 7, height / 5 + 2 * height / 5, 'misc', 1).setScale(5).setDepth(10).setOrigin(0.5, 1);
        this.brickText = this.add.bitmapText(width/3.5, height / 7.5 + 2 * height/5, 'pixelFont', 'Bricks Will Periodically Fall\n\nBeing hit deals 1 Damage ', 14).setScrollFactor(0).setOrigin(0, 0).setTintFill(0xffffff).setDepth(91).setLeftAlign();

        // pie text
        this.pie = this.add.sprite(width / 7, height / 5 + 3 * height / 5, 'misc', 0).setScale(5).setDepth(10).setOrigin(0.5, 1);
        this.pieText = this.add.bitmapText(width/3.5, height / 7.5 + 3 * height/5, 'pixelFont', 'Pie Will Periodically Spawn\n\nEating One Will Make You\n\nInvulnerable to Bricks ', 14).setScrollFactor(0).setOrigin(0, 0).setTintFill(0xffffff).setDepth(91).setLeftAlign();
        
        // next page or menu
        this.pg1Text = this.add.bitmapText(width/3.5, height / 7.5 + 4 * height/5, 'pixelFont', '{- Menu     Next -}', 14).setScrollFactor(0).setOrigin(0, 0).setTintFill(0xffffff).setDepth(91).setLeftAlign();

        // movement text
        this.level2Text = this.felix2Text = this.add.bitmapText(width/2, height / 7.5, 'pixelFont', 'These Mechanics Start On Level 2', 18).setScrollFactor(0).setOrigin(0.5).setTintFill(0xffffff).setDepth(91).setCenterAlign().setAlpha(0);

        this.felix2 = this.add.sprite(width / 7, height / 5 + height / 5, 'Felix', 0).setScale(2).setDepth(10).setOrigin(0.5, 1).setAlpha(0);
        this.felix2Text = this.add.bitmapText(width/3.5, height / 7.5 + height / 5, 'pixelFont', 'Falling will cause you\n\nto take damage', 14).setScrollFactor(0).setOrigin(0, 0).setTintFill(0xffffff).setDepth(91).setLeftAlign().setAlpha(0);

        // ralph info
        this.flowerpot = this.add.sprite(width / 7, height / 5 + 2 * height / 5, 'obstacle', 2).setScale(5).setDepth(10).setOrigin(0.5, 1).setAlpha(0);
        this.flowerpotText = this.add.bitmapText(width/3.5, height / 7.5 + 2 * height / 5, 'pixelFont', 'Flower Pots Spawn Randomly\n\nFelix is Unable to Jump\n\nUp or Down on Them', 14).setScrollFactor(0).setOrigin(0, 0).setTintFill(0xffffff).setDepth(91).setLeftAlign().setAlpha(0);
        
        // brick text
        this.window1 = this.add.sprite(width / 7, height / 5 + 3 * height / 5, 'obstacle', 1).setScale(5).setDepth(10).setOrigin(0.5, 0.5).setAlpha(0);
        this.window2 = this.add.sprite(width / 7, height / 5 + 3 * height / 5, 'obstacle', 0).setScale(5).setDepth(10).setOrigin(0.5, 0.5).setAlpha(0);
        this.windowText = this.add.bitmapText(width/3.5, height / 7.5 + 3 * height / 5, 'pixelFont', 'Window Shutters Spawn Randomly\n\nFelix is Unable to Jump\n\nLeft or Right past Them ', 14).setScrollFactor(0).setOrigin(0, 0).setTintFill(0xffffff).setDepth(91).setLeftAlign().setAlpha(0);
        
        // more/menu
        this.pg2Text = this.add.bitmapText(width/3.5, height / 7.5 + 4 * height / 5, 'pixelFont', '{- Prev            ', 14).setScrollFactor(0).setOrigin(0, 0).setTintFill(0xffffff).setDepth(91).setLeftAlign().setAlpha(0);

        this.clickSFX = this.sound.add('click').setVolume(0.5);
    }   

    update() {
        if (this.page == 1 && Phaser.Input.Keyboard.JustDown(this.leftKey)) {
            this.clickSFX.play();
            this.scene.start('menuScene');
        }

        // changes to page 2
        if (this.page == 1 && Phaser.Input.Keyboard.JustDown(this.rightKey)) {
            this.clickSFX.play();
            this.page = 2;
            this.felix.setAlpha(0);
            this.felixText.setAlpha(0);
            this.ralph.setAlpha(0);
            this.ralphText.setAlpha(0);
            this.brick.setAlpha(0);
            this.brickText.setAlpha(0);
            this.pie.setAlpha(0);
            this.pieText.setAlpha(0);
            this.pg1Text.setAlpha(0)
            this.level2Text.setAlpha(1);
            this.felix2.setAlpha(1);
            this.felix2Text.setAlpha(1);
            this.flowerpot.setAlpha(1);
            this.flowerpotText.setAlpha(1);
            this.window1.setAlpha(1);
            this.window2.setAlpha(1);
            this.windowText.setAlpha(1);
            this.pg2Text.setAlpha(1);
            this.immuneEvent = this.time.addEvent({
                delay: 200,
                callback: function () {
                    this.felix2.alpha = (this.felix2.alpha === 0) ? 1 : 0;
                },
                callbackScope: this,
                loop: true,
            });
        }

        // changes to page 1
        if (this.page == 2 && Phaser.Input.Keyboard.JustDown(this.leftKey)) {
            this.clickSFX.play();
            this.page = 1;
            this.felix.setAlpha(1);
            this.felixText.setAlpha(1);
            this.ralph.setAlpha(1);
            this.ralphText.setAlpha(1);
            this.brick.setAlpha(1);
            this.brickText.setAlpha(1);
            this.pie.setAlpha(1);
            this.pieText.setAlpha(1);
            this.pg1Text.setAlpha(1)
            this.level2Text.setAlpha(0);
            this.felix2.setAlpha(0);
            this.felix2Text.setAlpha(0);
            this.flowerpot.setAlpha(0);
            this.flowerpotText.setAlpha(0);
            this.window1.setAlpha(0);
            this.window2.setAlpha(0);
            this.windowText.setAlpha(0);
            this.pg2Text.setAlpha(0);
            this.immuneEvent.remove();
        }
    }
}