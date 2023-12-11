// Fix it Felix Remake
// Name: Edwin Fong
// Date: 12/15/23

// sfx: zapsplat

"use strict"

let config = {
    parent: 'phaser-game',
    type: Phaser.AUTO,
    render: {
        pixelArt: true,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    width: 640,
    height: 640,
    backgroundColor: '#000000',
    scene: [ Load, Menu, Play, End ],
}

let game = new Phaser.Game(config)
let cursors
let { height, width } = game.config

let centerX = game.config.width/2;
let centerY = game.config.height/2;
let level = 2;
let speed = 200;
let playerDirection = 'left';
let playerMovement = 'idle';
let isSuper = false;
let immune = false;
let fixOnCD = false;
let fixing = false;
let fixed = false;
let pieExists = false;
let ralphLocation = 2;
let lives = 3;
let score = 0;
let highscore = 0;
let gameOver = false;
let nextLevel = false;
let transitioning = false;
