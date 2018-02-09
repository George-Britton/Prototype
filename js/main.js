var game = new Phaser.Game(1800, 1000, Phaser.AUTO, null, { preload: preload, create: create, update: update, render: render });
var scene = "house", player, nextButton, previousButton, grandfather, constable, corpse, detective, inspector, door, background, menuButton, booksButton, destination, moving = false, direction = "left";

function preload() {
    this.game.load.image('house_background', 'images/house_background.png');
    this.game.load.image('crimeScene_background', 'images/crimeScene_background.png');
    this.game.load.image('confrontation_background', 'images/confrontation_background.png')
    this.game.load.image('dialogueBox', 'images/dialogueBox.png');
    this.game.load.image('menuButton', 'images/menuButton.png');
    this.game.load.image('booksButton', 'images/booksButton.png');
    this.game.load.image('destination', 'images/destination.png');
    this.game.load.spritesheet('player', 'images/player.png', 150, 150);
    this.game.load.spritesheet('grandfather', 'images/grandfather.png', 225, 225);
    this.game.load.spritesheet('constable', 'images/constable.png', 250, 250);
    this.game.load.spritesheet('detective', 'images/detective.png', 250, 250);
    this.game.load.spritesheet('inspector', 'images/inspector.png', 250, 250);
    this.game.load.image('corpse', 'images/body.png');
    this.game.load.image('nextButton', 'images/nextScene.png');
    this.game.load.image('previousButton', 'images/previousScene.png');
}

function create() {
    game.world.removeAll();
    if (scene == "house") {
        background = game.add.image(0, 0, 'house_background');
    } else if (scene == "crime scene") {
        background = game.add.image(0, 0, 'crimeScene_background');
    } else if (scene == "confrontation") {
        background = game.add.image(0, 0, 'confrontation_background');
    } //this if statement assigns the correct background image for the scene
       
    this.game.add.image(0, 700, 'dialogueBox');
    constable = game.add.sprite(1450, 393, 'constable');
    corpse = game.add.sprite(300, 585, 'corpse');
    grandfather = game.add.sprite(1300, 425, 'grandfather');
    player = game.add.sprite(1150, 500, 'player');
    menuButton = game.add.image(1725, 630, 'menuButton');
    booksButton = game.add.image(1635, 630, 'booksButton');
    nextButton = game.add.button(250, 800, 'nextButton', nextScene, this);
    previousButton = game.add.button(0, 800, 'previousButton', previousScene, this);

    game.physics.enable(constable, Phaser.Physics.ARCADE);
    game.physics.enable(corpse, Phaser.Physics.ARCADE);
    game.physics.enable(grandfather, Phaser.Physics.ARCADE);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.anchor.setTo(0.5, 0);
    player.body.setSize(player.width - 40, player.height - 20, 20, 20);
    grandfather.anchor.setTo(0.5, 0);
    grandfather.body.setSize(grandfather.width - 80, grandfather.height - 20, 20, 20);

    player.animations.add('playerIdleRight', [7], 1, true);
    player.animations.add('playerIdleLeft', [4], 1, true);
    player.animations.add('playerIdleFront', [1], 1, true);
    player.animations.add('playerIdleBack', [10], 1, true);
    player.animations.add('moveRight', [8, 7, 6, 7], 8, true);
    player.animations.add('moveLeft', [5, 4, 3, 4], 8, true);
    grandfather.animations.add('grandfatherIdleRight', [7], 1, true);
    grandfather.animations.add('grandfatherIdleLeft', [4], 1, true);
    grandfather.animations.add('grandfatherIdleFront', [1], 1, true);
    constable.animations.add('constableIdleLeft', [4], 1, true);
    constable.animations.add('constableIdleFront', [1], 1, true);

    direction = "left";
}

function nextScene() {
    if (scene == "crime scene") {
        scene = "confrontation";
        create();
        stopMoving();
    } else if (scene == "house") {
        scene = "crime scene";
        create();
        stopMoving();
    }
}

function previousScene() {
    if (scene == "crime scene") {
        scene = "house";
        create();
        stopMoving();
    } else if (scene == "confrontation") {
        scene = "crime scene";
        create();
        stopMoving();
    }
}

function onTap(pointer) {
    if (pointer.y < 700) {
        destination = game.add.sprite(pointer.x, pointer.y, 'destination');
        moving = true;
        if (destination.x < player.x) {
            direction = "left";
        } else if (destination.x > player.x) {
            direction = "right";
        }
    }
}

function stopMoving() {
    moving = false;
    destination.destroy();
    player.body.velocity.x = 0;
}

function update() {
    if (scene == "house") {
        grandfather.animations.play('grandfatherIdleLeft');
        grandfather.visible = true;
        corpse.visible = false;
        constable.visible = false;
        player.y = 500;
        grandfather.x = 1350;
        grandfather.y = 425;
    } else if (scene == "crime scene") {
        grandfather.animations.play('grandfatherIdleLeft');
        constable.animations.play('constableIdleLeft');
        grandfather.visible = true;
        corpse.visible = true;
        constable.visible = true;
        player.y = 494;
        grandfather.x = 1375;
        grandfather.y = 421;
        constable.x = 1405;
        constable.y = 393;
    } else if (scene == "clue search") {
        player.animations.play('playerIdleBack');
    } else if (scene == "confrontation") {
        grandfather.animations.play('grandfatherIdleLeft');
        constable.animations.play('constableIdleLeft');
        grandfather.visible = true;
        constable.visible = true;
        corpse.visible = false;
        player.y = 540;
        grandfather.x = 1550;
        grandfather.y = 450;
        constable.x = 1350;
        constable.y = 300;
    } // this if statement hides or shows the needed sprites for the scene, puts them in position, and makes them face the right direction

    if (moving) {
        if (destination.x < player.x - 50) {
            player.body.velocity.x = -300;
            player.animations.play('moveLeft');
        } else if (destination.x > player.x + 50) {
            player.body.velocity.x = 300;
            player.animations.play('moveRight');
        } else {
            stopMoving();
        }
    } else {
        if (direction == "left") {
            player.animations.play('playerIdleLeft');
        } else {
            player.animations.play('playerIdleRight');
        } // this if statement makes sure that the player is facing the right direction when they stop walking
    }
    if (!moving && player.x < 550 && player.x > 250 && scene == "confrontation") {
        player.animations.play('playerIdleBack');
    }

    if (grandfather.visible == true) {
        grandfather.body.immovable = true;
        game.physics.arcade.collide(player, grandfather, stopMoving, null, this);
    }
    if (corpse.visible == true) {
    corpse.body.immovable = true;
    game.physics.arcade.collide(player, corpse, stopMoving, null, this);
    }

    game.input.onTap.add(onTap, this);
}

function render() {
    
}