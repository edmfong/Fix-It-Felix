// Fix it Felix Remake
// Name: Edwin Fong
// Date: 12/15/23

// approximate hours spent: 25
// creative tilt:
// tweens for falling animation, created custom headers, changed css to center and customize background,
// spawning multiple objects with different textures and sfx

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
    scene: [ Load, Menu, Play ],
}

let game = new Phaser.Game(config)
let cursors
let { height, width } = game.config

// let spaceBar;
// let keyUP;
// let keyR;
// let groundLevel = height  - 190;
let centerX = game.config.width/2;
let centerY = game.config.height/2;
let level = 1;
let speed = 200;
let playerDirection = 'left';
let playerMovement = 'idle';
let isSuper = false;
let fixOnCD = false;
let fixing = false;
let fixed = false;
let pieExists = false;
let ralphLocation = 2;
let lives = 3;
let gameOver = false;
let nextLevel = false;
// let velocity = 450;
// let skySpeed = 1;
// let buildingSpeed = 0.5;
// let gameOver = false;
// let killedBy;
// let time = 0;
// let highScore = 0;