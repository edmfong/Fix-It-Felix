class End extends Phaser.Scene {
    constructor() {
        super('endScene');
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        // load felix, ralph, and buildings
        // preloads npcs, medal, and clouds
        this.buildings = this.add.image((width + (62*5)) /2 , height*1.425, 'endScene_building').setScale(5);
        this.felix = this.add.sprite(width / 3, height / 2.2, 'Felix', 0).setScale(2).setDepth(10).setOrigin(0.5, 1);
        this.ralph = this.add.sprite(width / 1.3, height / 2.8, 'Ralph', 0).setScale(4).setDepth(10).setOrigin(0.5, 0.5);

        this.cloud1 = this.add.sprite(width/1.7, height/6, 'cloud').setScale(5.5);
        this.medal = this.add.sprite(width/2, height/4, 'medal').setScale(3.5).setAlpha(0);
        this.cloud2 = this.add.sprite(width/2.3, height/5, 'cloud').setScale(5.5);

        this.npcGroup = this.add.group();
        this.createNPC(this, width/4.25, height/2.33, 'npc', 6, this.npcGroup);
        this.createNPC(this, width/4.25, height/2.33, 'npc', 7, this.npcGroup);
        this.createNPC(this, width/4.25, height/2.33, 'npc', 8, this.npcGroup);
        this.createNPC(this, width/4.25, height/2.33, 'npc', 9, this.npcGroup);
        this.createNPC(this, width/4.25, height/2.33, 'npc', 10, this.npcGroup);
        this.createNPC(this, width/4.25, height/2.33, 'npc', 11, this.npcGroup);

        // Create a graphics object
        this.statsBar = this.add.graphics();

        // Draw a black rectangle at the top of the screen
        this.blackBar = this.statsBar.fillStyle(0x000000, 1);
        this.blackBar.fillRect(0, 0, game.config.width, 70);
        this.blackBar.setDepth(90);

        // Display player lives, score, highscore (temp)
        this.scoreString = String(score).padStart(6, '0');
        this.highscoreString = String(highscore).padStart(6, '0');

        this.livesDisplay = this.add.image(width - (width + 64)/9, 15, 'lives', lives).setScrollFactor(0).setOrigin(0.5, 0).setDepth(91).setScale(2.5);
        this.scoreText = this.add.bitmapText(width/10, 10, 'pixelFont', 'Score', 18).setScrollFactor(0).setOrigin(0.5, 0).setTintFill(0xff0000).setDepth(91);
        this.scoreDisplay = this.add.bitmapText(width/10, 40, 'pixelFont', this.scoreString, 18).setScrollFactor(0).setOrigin(0.5, 0).setTintFill(0xffffff).setDepth(91);
        this.highScoreText = this.add.bitmapText(width/2, 10, 'pixelFont', 'High Score', 18).setScrollFactor(0).setOrigin(0.5, 0).setTintFill(0xff0000).setDepth(91);
        this.highScoreDisplay = this.add.bitmapText(width/2, 40, 'pixelFont', this.highscoreString, 18).setScrollFactor(0).setOrigin(0.5, 0).setTintFill(0xffffff).setDepth(91);

        // animations
        this.npcWalkMid(() => {
            this.npcJump1;
            this.npcJump2;
            this.npcJump(() => {
                this.giveMedal(() => {
                    this.pushRalph(() => {
                        this.ralphFall();
                    });
                });
            });
        });
        
        // sfx
        this.fixSFX = this.sound.add('fix').setVolume(0.5);
        this.winSFX = this.sound.add('win').setVolume(0.4);
        this.fallingSFX = this.sound.add('falling').setVolume(0.3);
        this.impactSFX = this.sound.add('impact').setVolume(0.3);

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.clickSFX = this.sound.add('click').setVolume(0.5);
        this.animationComplete = false;
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.animationComplete) {
            this.scene.start('menuScene');
        }
    }

    createNPC(scene, x, y, texture, frame, group) { // create npcs and put them in a group
        this.npc = scene.add.sprite(x, y, texture, frame).setScale(2).setAlpha(0);
        group.add(this.npc);
      }

    npcWalkMid(callback) { // make npcs appear and walk in a line
        this.time.delayedCall(1000, () => {
            this.npcGroup.getChildren()[5].setAlpha(1);
            this.tweens.add({
                targets: this.npcGroup.getChildren()[5],
                x: width/2.9 + 6 * 30,
                duration: 3 * ((width/2.9 + 6 * 30)),
            });
            this.time.delayedCall(300, () => {
                this.npcGroup.getChildren()[4].setAlpha(1);
                this.tweens.add({
                    targets: this.npcGroup.getChildren()[4],
                    x: width/2.9 + 5 * 30,
                    duration: 3 * ((width/2.9 + 5 * 30)),
                });
            });
            this.time.delayedCall(600, () => {
                this.npcGroup.getChildren()[3].setAlpha(1);
                this.tweens.add({
                    targets: this.npcGroup.getChildren()[3],
                    x: width/2.9 + 4 * 30,
                    duration: 3 * ((width/2.9 + 4 * 30)),
                });
            });
            this.time.delayedCall(900, () => {
                this.npcGroup.getChildren()[2].setAlpha(1);
                this.tweens.add({
                    targets: this.npcGroup.getChildren()[2],
                    x: width/2.9 + 3 * 30,
                    duration: 3 * ((width/2.9 + 3 * 30)),
                });
            });
            this.time.delayedCall(1200, () => {
                this.npcGroup.getChildren()[1].setAlpha(1);
                this.tweens.add({
                    targets: this.npcGroup.getChildren()[1],
                    x: width/2.9 + 2 * 30,
                    duration: 3 * ((width/2.9 + 2 * 30)),
                });
            });
            this.time.delayedCall(1500, () => {
                this.npcGroup.getChildren()[0].setAlpha(1);
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

    npcJump(callback) { // make npcs look like they're jumping
        this.npcJump1 = this.tweens.add({
            targets: [this.npcGroup.getChildren()[5], this.npcGroup.getChildren()[3], this.npcGroup.getChildren()[1]],
            y: '-=5',
            yoyo: true,
            duration: 300,
            ease: 'Power2',
            repeat: -1,
        });
        this.time.delayedCall(200, () => {
            this.npcJump2 = this.tweens.add({
                targets: [this.npcGroup.getChildren()[4], this.npcGroup.getChildren()[2], this.npcGroup.getChildren()[0]],
                y: '-=5',
                yoyo: true,
                duration: 300,
                ease: 'Power2',
                repeat: -1,
            });
        });
        callback();
    }

    giveMedal(callback) {
        this.time.delayedCall(300, () => {
            this.winSFX.play();
        });
        this.tweens.add({ // reveal medal
            targets: this.medal,
            alpha: 1,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.tweens.add({ // move cloud1 to the right
                    targets: this.cloud1,
                    x: width + this.cloud1.width * 5.5,
                    duration: 2000,
                });
                this.tweens.add({ // move cloud2 to the left
                    targets: this.cloud2,
                    x: 0 - this.cloud2.width * 5.5,
                    duration: 2000,
                    onComplete: () => {
                        this.cloud1.setAlpha(0);
                        this.cloud2.setAlpha(0);
                        this.time.delayedCall(2200, () => {
                            this.fixSFX.play()
                            });
                        this.tweens.add({ // move medal towards felix
                            targets: this.medal,
                            x: this.felix.x,
                            y: this.felix.y - this.felix.height,
                            scale: 0.5,
                            ease: 'Power2',
                            duration: 3000,
                            onComplete: () => { // make npcs look angry
                                this.felix.setTexture('Felix', 12);
                                this.npcJump1.stop();
                                this.npcJump2.stop();
                                this.npcGroup.getChildren().forEach(npc => {
                                    npc.setTexture(npc.texture, npc.frame.name - 6);
                                    npc.y = height/2.33
                                });
                                callback();
                            }
                        });
                    }
                });
            }
        });
    }

    pushRalph(callback) {
        this.tweens.add({ // move camera over
            targets: this.cameras.main,
            scrollX: (width - (64*5.2)),
            duration: 3000,
            ease: 'Power2'
        });
        this.tweens.add({ // move npcs right
            targets: this.npcGroup.getChildren(),
            x: '+=170',
            duration: 1000,
        });
        this.time.delayedCall(500, () => { // move ralph up to look like he's being carried
            this.ralph.play('ralph_carry');
            this.tweens.add({
                targets: this.ralph,
                y: '-=20',
                duration: 300,
                ease: 'Power2',
                onComplete: () => { // semi-circle
                    this.time.delayedCall(500, () => {
                        this.fallingSFX.play();
                    });
                    this.tweens.add({
                        targets: this.ralph,
                        x: {
                            value: '+=100',
                            ease: 'Sine.easeInOut',
                        },
                        y: {
                            value: '-=50',
                            ease: 'Cubic.Out',
                        },
                        duration: 250,
                        onComplete: () => {
                            this.tweens.add({
                                targets: this.ralph,
                                x: {
                                    value: '+=100',
                                    ease: 'Sine.easeInOut',
                                },
                                y: {
                                    value: '+=50',
                                    ease: 'Cubic.In',
                                },
                                duration: 250,
                                onComplete: () => {
                                    callback();
                                }
                            });
                        },
                    });
                }
            });
        });
    }

    ralphFall() {
        this.ralph.play('ralph_fall');
        this.tweens.add({ // move to middle
            targets: this.ralph,
            y: height - height/3,
            duration: 1000,
        });
        this.ralphRotate = this.tweens.add({ // rotate while falling
            targets: this.ralph,
            angle: 360,
            duration: 2009,
            repeat: -1
        });
        this.tweens.add({ // move building up
            targets: this.buildings,
            y: -64 * 5,
            duration: 5000,
            onComplete: () => {
                this.tweens.add({ // move to ground
                    targets: this.ralph,
                    y: height - height/8,
                    duration: 1000,
                    onComplete: () => {
                        this.animationComplete = true;
                        this.ralphRotate.stop();
                        this.ralph.stop()
                        this.ralph.setAngle(0);
                        this.ralph.setTexture('ralph_dead');
                        this.impactSFX.play();
                        // game over text
                        this.winText = this.add.bitmapText(width/2, height/2, 'pixelFont', 'You Win!', 18).setScrollFactor(0).setOrigin(0.5, 0.5).setTintFill(0xffffff).setDepth(14);
                        this.pressSpaceText = this.add.bitmapText(width/2, height/2 + 30, 'pixelFont', 'Press [SPACE] for Menu', 18).setScrollFactor(0).setOrigin(0.5, 0.5).setTintFill(0xffffff).setDepth(14);
                            this.time.addEvent({
                                delay: 1500,
                                callback: () => {
                                    this.winText.setText('You Win!');
                                },
                                callbackScope: this,
                                loop: true
                            });
                            this.time.addEvent({
                                delay: 1450,
                                callback: () => {
                                    this.winText.setText('');
                                },
                                callbackScope: this,
                                loop: true
                            });
                            this.time.addEvent({
                                delay: 1500,
                                callback: () => {
                                    this.pressSpaceText.setText('Press [SPACE] for Menu');
                                },
                                callbackScope: this,
                                loop: true
                            });
                            this.time.addEvent({
                                delay: 1450,
                                callback: () => {
                                    this.pressSpaceText.setText('');
                                },
                                callbackScope: this,
                                loop: true
                            });
                    }
                });
            }
        });
        this.tweens.add({ // move npcs up
            targets: this.npcGroup.getChildren(),
            y: 0,
            duration: 1110,
        });
    }


}