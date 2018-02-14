var game = new Phaser.Game(1800, 1000, Phaser.AUTO, null, { preload: preload, create: create, update: update, render: render });
var scene = "house", player, nextButton, previousButton, grandfather, constable, corpse, detective, inspector, door, background,
    dialogueBox, menuButton, menuScroll, resumeButton, startOverButton, quitButton, paused = false, booksButton, book, bookBackButton,
    bookOut = "logbook", poisonTab, bugsTab, logbookTab, destination, moving = false, direction = "left",
    clueSearchKey, keyFound, keyClue;

function preload() {
    this.game.load.image('house_background', 'images/house_background.png');
    this.game.load.image('crimeScene_background', 'images/crimeScene_background.png');
    this.game.load.image('clueSearch_background', 'images/clueSearch_background.png');
    this.game.load.image('confrontation_background', 'images/confrontation_background.png');
    this.game.load.image('dialogueBox', 'images/dialogueBox.png');
    this.game.load.image('menuButton', 'images/menuButton.png');
    this.game.load.image('menu', 'images/menuTemp.png');
    this.game.load.image('resumeButton', 'images/resumeButton.png');
    this.game.load.image('startOverButton', 'images/startOverButton.png');
    this.game.load.image('quitButton', 'images/quitButton.png');
    this.game.load.image('booksButton', 'images/booksButton.png');
    this.game.load.image('book', 'images/book.png');
    this.game.load.image('bookBackButton', 'images/bookBackButton.png');
    this.game.load.image('logbookTab', 'images/logbookTab.png');
    this.game.load.image('poisonTab', 'images/poisonTab.png');
    this.game.load.image('bugsTab', 'images/bugsTab.png');
    this.game.load.image('destination', 'images/destination.png');
    this.game.load.spritesheet('player', 'images/player.png', 150, 150);
    this.game.load.spritesheet('grandfather', 'images/grandfather.png', 225, 225);
    this.game.load.spritesheet('constable', 'images/constable.png', 250, 250);
    this.game.load.spritesheet('detective', 'images/detective.png', 250, 250);
    this.game.load.spritesheet('inspector', 'images/inspector.png', 250, 250);
    this.game.load.image('corpse', 'images/body.png');
    this.game.load.image('clueSearch_key', 'images/clueSearch_key.png');
    this.game.load.image('nextButton', 'images/nextScene.png');
    this.game.load.image('previousButton', 'images/previousScene.png');
}

function create() {
    game.world.removeAll();
    if (scene == "house") {background = game.add.image(0, 0, 'house_background');
    } else if (scene == "crime scene") {background = game.add.image(0, 0, 'crimeScene_background');
    } else if (scene == "clue search") {background = game.add.image(0, 0, 'clueSearch_background');
    } else if (scene == "confrontation") {background = game.add.image(0, 0, 'confrontation_background');
    } //this if statement assigns the correct background image for the scene
       
    dialogueBox = game.add.image(0, 700, 'dialogueBox');
    constable = game.add.sprite(1450, 393, 'constable');
    corpse = game.add.sprite(300, 585, 'corpse');
    grandfather = game.add.sprite(1300, 425, 'grandfather');
    player = game.add.sprite(1150, 500, 'player');
    menuButton = game.add.button(1725, 630, 'menuButton', showMenu, this);
    booksButton = game.add.button(1635, 630, 'booksButton', showBooks, this);
    // this group of code creates the main set of sprites and images

    menuScroll = game.add.image(550, 100, 'menu');
    resumeButton = game.add.button(700, 235, 'resumeButton', resume, this);
    startOverButton = game.add.button(700, 410, 'startOverButton', startOver, this);
    quitButton = game.add.button(700, 585, 'quitButton', quit, this);
    menuScroll.visible = false;
    resumeButton.visible = false;
    startOverButton.visible = false;
    quitButton.visible = false;
    // this group of code create the pause menu for the game

    book = game.add.image(150, 75, 'book');
    bookBackButton = game.add.button(253, 92, 'bookBackButton', closeBook, this);
    logbookTab = game.add.button(1555, 120, 'logbookTab', openLogbook, this);
    logbookTab.rotation = -0.05;
    poisonTab = game.add.button(1580, 370, 'poisonTab', openPoison, this);
    poisonTab.rotation = -0.05;
    bugsTab = game.add.button(1605, 620, 'bugsTab', openBugs, this);
    bugsTab.rotation = -0.05;
    book.visible = false;
    bookBackButton.visible = false;
    logbookTab.visible = false;
    poisonTab.visible = false;
    bugsTab.visible = false;
    // this group of code creates the books the player has to use

    clueSearchKey = game.add.button(886, 353, 'clueSearch_key', keyFind, this);

    nextButton = game.add.button(250, 900, 'nextButton', nextScene, this);
    previousButton = game.add.button(0, 900, 'previousButton', previousScene, this);

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
    grandfather.animations.add('grandfatherIdleBack', [10], 1, true);
    constable.animations.add('constableIdleLeft', [4], 1, true);
    constable.animations.add('constableIdleFront', [1], 1, true);
    constable.animations.add('constableIdleBack', [10], 1, true);

    if (scene != "clue search") {
        direction = "left";
    }
}

function keyFind() {

}

function showMenu() {
    if (!paused) {
        paused = true;
        stopMoving();
        player.visible = false;
        menuScroll.visible = true;
        resumeButton.visible = true;
        quitButton.visible = true;
        startOverButton.visible = true;
    }
} // this function brings up the pause menu

function resume() {
    paused = false;
    menuScroll.visible = false;
    resumeButton.visible = false;
    startOverButton.visible = false;
    quitButton.visible = false;
    player.visible = true;    
    stopMoving();
} // this function resumes the game from the start menu

function startOver() {
    paused = false;
    scene = "house";
    create();
    stopMoving();
} // this function restarts the game

function quit() {
    window.location.href = "https://georgebritton.nuacomputerscience.co.uk";
} //this function send the player to my blog

function showBooks() {
    if (!paused) {
        paused = true;
        book.visible = true;
        bookBackButton.visible = true;
        logbookTab.visible = true;
        poisonTab.visible = true;
        bugsTab.visible = true;
        player.visible = false;
        stopMoving();
    }
} // this function brings up the player's books

function closeBook() {
    if (paused) {
        book.visible = false;
        bookBackButton.visible = false;
        logbookTab.visible = false;
        poisonTab.visible = false;
        bugsTab.visible = false;
        player.visible = true;
        paused = false;
        stopMoving();
    }
} // this function closes the player's books

function openLogbook() {
    bookOut = "logbook";
    logbookTab.x = 1555;
    poisonTab.x = 1580;
    bugsTab.x = 1605;
    stopMoving();
} // this function opens the player's logbook

function openPoison() {
    bookOut = "poison";
    logbookTab.x = 1585;
    poisonTab.x = 1567;
    bugsTab.x = 1605;
    stopMoving();
} // this function opens the book on poisons

function openBugs() {
    bookOut = "bugs";
    logbookTab.x = 1585;
    poisonTab.x = 1600;
    bugsTab.x = 1581;
    stopMoving();
} // this function opens the book on bugs

function nextScene() {
    if (scene == "clue search") {
        scene = "confrontation";
        create();
        stopMoving();
    }else if (scene == "crime scene") {
        scene = "clue search";
        create();
        stopMoving();
    } else if (scene == "house") {
        scene = "crime scene";
        create();
        stopMoving();
    }
    paused = false;
} // this function changes to the next scene

function previousScene() {
    if (scene == "crime scene") {
        scene = "house";
        create();
        stopMoving();
    } else if (scene == "clue search") {
        scene = "crime scene";
        create();
        stopMoving();
    } else if (scene == "confrontation") {
        scene = "clue search";
        create();
        stopMoving();
    }
    paused = false;
} // this function changes to the previous scene, and will be removed later

function onTap(pointer) {
    if (pointer.y < 700 && scene != "clue search") {
        destination = game.add.sprite(pointer.x, pointer.y, 'destination');
        moving = true;
        if (destination.x < player.x) {
            direction = "left";
        } else if (destination.x > player.x) {
            direction = "right";
        }
    }
} // this function spawns a 'destination' sprite when the player taps the top screen, and then sets a direction to face

function stopMoving() {
    moving = false;
    destination.destroy();
    player.body.velocity.x = 0;
} // this function despawns the 'destination' sprite and stops the player's movement

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
        grandfather.animations.play('grandfatherIdleBack');
        constable.animations.play('constableIdleBack');
        dialogueBox.visible = false;
        corpse.x = 700;
        corpse.y = 300;
        player.x = 878;
        player.y = 700;
        menuButton.y = 925;
        booksButton.y = 925;
        grandfather.x = 750;
        grandfather.y = 750;
        constable.x = 900;
        constable.y = 725;
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
        if (scene != "clue search") {
            if (direction == "left") {
                player.animations.play('playerIdleLeft');
            } else {
                player.animations.play('playerIdleRight');
            }
        } // this if statement makes sure that the player is facing the right direction when they stop walking
    }

    if (!moving && player.x < 550 && player.x > 250 && scene == "confrontation") {
        player.animations.play('playerIdleBack');
    } // this small if statement makes the player face the suspect when they're right next to them

    if (grandfather.visible == true) {
        grandfather.body.immovable = true;
        game.physics.arcade.collide(player, grandfather, stopMoving, null, this);
    }
    if (corpse.visible == true) {
        corpse.body.immovable = true;
        game.physics.arcade.collide(player, corpse, stopMoving, null, this);
    } // these two if statements make the corpse and grandfather impassable if they are visible

    if (!paused) {
        game.input.onTap.add(onTap, this);
    }
}

function render() {
    
}