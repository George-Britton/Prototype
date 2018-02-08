var game = new Phaser.Game(1800, 1000, Phaser.AUTO, null, { preload: preload, create: create, update: update, render: render });
var scene, player, grandfather, constable, corpse, detective, inspector, door, background, menuButton, booksButton, destination, moving = false, direction = "left";

function preload() {
    scene = "crime scene";

    this.game.load.image('house_background', 'images/house_background.png');
    this.game.load.image('crimeScene_background', 'images/crimeScene_background.png');
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
}

function create() {
    if (scene == "house") {
        background = game.add.image(0, 0, 'house_background');
        this.game.add.image(0, 700, 'dialogueBox');
        menuButton = game.add.image(1725, 630, 'menuButton');
        booksButton = game.add.image(1635, 630, 'booksButton');

        grandfather = game.add.sprite(1300, 425, 'grandfather')
        game.physics.enable(grandfather, Phaser.Physics.ARCADE);

        player = game.add.sprite(1000, 500, 'player')
        game.physics.enable(player, Phaser.Physics.ARCADE);

    } else if (scene == "crime scene") {
        background = game.add.image(0, 0, 'crimeScene_background');
        this.game.add.image(0, 700, 'dialogueBox');
        menuButton = game.add.image(1725, 630, 'menuButton');
        booksButton = game.add.image(1635, 630, 'booksButton');

        grandfather = game.add.sprite(1300, 421, 'grandfather')
        game.physics.enable(grandfather, Phaser.Physics.ARCADE);

        constable = game.add.sprite(1450, 393, 'constable');
        game.physics.enable(constable, Phaser.Physics.ARCADE);

        corpse = game.add.sprite(300, 585, 'corpse');
        game.physics.enable(corpse, Phaser.Physics.ARCADE);

        player = game.add.sprite(1100, 494, 'player')
        game.physics.enable(player, Phaser.Physics.ARCADE);
    }

    player.anchor.setTo(0.5, 0);
    grandfather.anchor.setTo(0.5, 0);

    player.animations.add('playerIdleRight', [7], 1, true);
    player.animations.add('playerIdleLeft', [4], 1, true);
    player.animations.add('playerIdleFront', [1], 1, true);
    player.animations.add('playerIdleBack', [10], 1, true);
    player.animations.add('moveRight', [8, 7, 6, 7], 6, true);
    player.animations.add('moveLeft', [5, 4, 3, 4], 6, true);
    grandfather.animations.add('grandfatherIdleRight', [7], 1, true);
    grandfather.animations.add('grandfatherIdleLeft', [4], 1, true);
    grandfather.animations.add('grandfatherIdleFrontt', [1], 1, true);
    constable.animations.add('constableIdleLeft', [4], 1, true);
    constable.animations.add('constableIdleFront', [1], 1, true);
    detective.animations.add('detectiveIdleFront', [1], 1, true);
    inspector.animations.add('inspectorIdleFront', [1], 1, true);

}

function onTap(pointer) {
    destination = game.add.sprite(pointer.x, pointer.y, 'destination');
    moving = true;
    if (destination.x < player.x) {
        direction = "left";
    } else if (destination.x > player.x) {
        direction = "right";
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
    } else if (scene == "crime scene") {
        grandfather.animations.play('grandfatherIdleLeft');
        constable.animations.play('constableIdleLeft');
    } else if (scene == "clue search") {
        player.animations.play('playerIdleBack');
    } else if (scene == "constbulary") {
        grandfather.animations.play('grandfatherIdleFront');
        constable.animations.play('constableIdleFront');
        detective.animations.play('detectiveIdleFront');
        inspector.animations.play('inspectorIdleFront');
    }

    if (moving) {
        if (destination.x < player.x - 50) {
            player.body.velocity.x = -150;
            player.animations.play('moveLeft');
        } else if (destination.x > player.x + 50) {
            player.body.velocity.x = 150;
            player.animations.play('moveRight');
        } else {
            stopMoving();
        }
    } else {
        if (direction == "left") {
            player.animations.play('playerIdleLeft');
        } else {
            player.animations.play('playerIdleRight');
        }
    }

    grandfather.body.immovable = true;
    game.physics.arcade.collide(player, grandfather, stopMoving, null, this);

    corpse.body.immovable = true;
    game.physics.arcade.collide(player, corpse, stopMoving, null, this);



    game.input.onTap.add(onTap, this);
}

function render() {

}