class Credits extends Phaser.Scene {
    constructor() {
        super('creditScene');
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.add.bitmapText(width/2, height / 7.5, 'pixelFont', 'CREDITS', 24).setScrollFactor(0).setOrigin(0.5, 0).setTintFill(0xffffff).setDepth(91).setCenterAlign();
        this.add.bitmapText(width/2, height / 7.5 + 1 * height / 7, 'pixelFont', 'Original "Game":\n\nFix it Felix Jr. from Wreck it Ralph', 14).setScrollFactor(0).setOrigin(0.5, 0).setTintFill(0xffffff).setDepth(91).setCenterAlign();
        this.add.bitmapText(width/2, height / 7.5 + 2 * height / 7, 'pixelFont', 'SFX:\n\nZapsplat', 14).setScrollFactor(0).setOrigin(0.5, 0).setTintFill(0xffffff).setDepth(91).setCenterAlign();
        this.add.bitmapText(width/2, height / 7.5 + 3 * height / 7, 'pixelFont', 'Art:\n\nEdwin Fong', 14).setScrollFactor(0).setOrigin(0.5, 0).setTintFill(0xffffff).setDepth(91).setCenterAlign();
        this.add.bitmapText(width/2, height / 7.5 + 4 * height / 7, 'pixelFont', 'Programming:\n\nEdwin Fong', 14).setScrollFactor(0).setOrigin(0.5, 0).setTintFill(0xffffff).setDepth(91).setCenterAlign();

        this.add.bitmapText(width/2, height / 7.5 + 4 * height/5, 'pixelFont', '{- Menu', 14).setScrollFactor(0).setOrigin(0.5, 0).setTintFill(0xffffff).setDepth(91);
    }
}