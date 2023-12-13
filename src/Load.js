class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        // font
        this.load.bitmapFont('pixelFont', './assets/font/PressStart2P.png', './assets/font/PressStart2P.xml');

        // loading bar from
        // https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/#:~:text=In%20Phaser%2C%20before%20you%20can,preloader%20really%20makes%20a%20difference
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(centerX - (320/2), centerY - 5 - (50/2), 320, 50);

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: 'pixelFont',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px pixelFont',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px pixelFont',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(centerX - (320/2) + 10, centerY - 5 - (50/2) + 10, 300 * value, 30);
        });

        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });

        // load assets
        this.load.spritesheet('Felix', './assets/spritesheet/felix.png', {
            frameWidth: 32,
            frameHeight: 32,
        });

        this.load.spritesheet('Ralph', './assets/spritesheet/ralph.png', {
            frameWidth: 32,
            frameHeight: 32,
        });

        this.load.spritesheet('hat', './assets/spritesheet/hat.png', {
            frameWidth: 32,
            frameHeight: 32,
        });

        this.load.spritesheet('misc', './assets/spritesheet/misc.png', {
            frameWidth: 8,
            frameHeight: 8,
        });

        this.load.spritesheet('buildings', './assets/spritesheet/buildings.png', {
            frameWidth: 128,
            frameHeight: 128,
        });

        this.load.spritesheet('obstacle', './assets/spritesheet/obstacles.png', {
            frameWidth: 16,
            frameHeight: 16,
        });

        this.load.spritesheet('window_1', './assets/spritesheet/window_1.png', {
            frameWidth: 16,
            frameHeight: 16,
        });

        this.load.spritesheet('window_2', './assets/spritesheet/window_2.png', {
            frameWidth: 16,
            frameHeight: 16,
        });

        this.load.spritesheet('npc', './assets/spritesheet/npc.png', {
            frameWidth: 16,
            frameHeight: 16,
        });

        this.load.spritesheet('lives', './assets/spritesheet/lives.png', {
            frameWidth: 48,
            frameHeight: 16,
        });

        this.load.image('cloud', './assets/spritesheet/cloud.png');

        this.load.image('medal', './assets/spritesheet/medal.png');

        this.load.image('menu', './assets/menu.png')

        this.load.image('ralph_dead', './assets/spritesheet/ralph_dead.png');

        this.load.image('endScene_building', './assets/spritesheet/endScene_building.png');

        // load sfx
        this.load.audio('punch', './assets/sfx/punch.mp3');
        this.load.audio('fix', './assets/sfx/fix.mp3');
        this.load.audio('jump', './assets/sfx/jump.mp3');
        this.load.audio('click', './assets/sfx/click.mp3');
        this.load.audio('hit', './assets/sfx/hit.mp3');
        this.load.audio('eat', './assets/sfx/eat.mp3');
        this.load.audio('win', './assets/sfx/win.mp3');
        this.load.audio('falling', './assets/sfx/falling.mp3');
        this.load.audio('impact', './assets/sfx/impact.mp3');
        this.load.audio('window_break', './assets/sfx/window_break.mp3');
        this.load.audio('gameOver', './assets/sfx/gameOver.mp3');
    }

    create() {
        // felix animations
        this.anims.create({
            key: 'felix_idle_right',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('Felix', {
                start: 0,
                end: 0,
            }),
        });

        this.anims.create({
            key: 'felix_idle_left',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('Felix', {
                start: 4,
                end: 4,
            }),
        });

        this.anims.create({
            key: 'felix_walk_right',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('Felix', {
                start: 0,
                end: 3,
            }),
        });

        this.anims.create({
            key: 'felix_walk_left',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('Felix', {
                start: 4,
                end: 7,
            }),
        });

        this.anims.create({
            key: 'felix_fix_right',
            frameRate: 5,
            repeat: 1,
            frames: this.anims.generateFrameNumbers('Felix', {
                start: 8,
                end: 9,
            }),
        });

        this.anims.create({
            key: 'felix_fix_left',
            frameRate: 5,
            repeat: 1,
            frames: this.anims.generateFrameNumbers('Felix', {
                start: 10,
                end: 11,
            }),
        });

        // hat animations
        this.anims.create({
            key: 'hat_idle_right',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hat', {
                start: 0,
                end: 0,
            }),
        });

        this.anims.create({
            key: 'hat_idle_left',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hat', {
                start: 4,
                end: 4,
            }),
        });

        this.anims.create({
            key: 'hat_walk_right',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hat', {
                start: 0,
                end: 3,
            }),
        });

        this.anims.create({
            key: 'hat_walk_left',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hat', {
                start: 4,
                end: 7,
            }),
        });

        this.anims.create({
            key: 'hat_fix_right',
            frameRate: 5,
            repeat: 1,
            frames: this.anims.generateFrameNumbers('hat', {
                start: 8,
                end: 9,
            }),
        });

        this.anims.create({
            key: 'hat_fix_left',
            frameRate: 5,
            repeat: 1,
            frames: this.anims.generateFrameNumbers('hat', {
                start: 10,
                end: 11,
            }),
        });

        // ralph animations
        this.anims.create({
            key: 'ralph_walk',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('Ralph', {
                start: 0,
                end: 3,
            }),
        });

        this.anims.create({
            key: 'ralph_idle',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('Ralph', {
                start: 0,
                end: 0,
            }),
        });

        this.anims.create({
            key: 'ralph_attack',
            frameRate: 5,
            repeat: 3,
            frames: this.anims.generateFrameNumbers('Ralph', {
                start: 4,
                end: 5,
            }),
        });

        this.anims.create({
            key: 'ralph_fall',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('Ralph', {
                start: 6,
                end: 7,
            }),
        });

        this.anims.create({
            key: 'ralph_carry',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('Ralph', {
                start: 8,
                end: 9,
            }),
        });

        // finished loading
        this.scene.start('menuScene');
    }
}