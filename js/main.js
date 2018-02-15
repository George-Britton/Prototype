var game = new Phaser.Game(1800, 1000, Phaser.AUTO, null, { preload: preload, create: create, update: update, render: render });
var scene = "house", player, nextButton, previousButton, grandfather, constable, corpse, detective, inspector, door, background,
    dialogueBox, menuButton, menuScroll, resumeButton, startOverButton, quitButton, paused = false, booksButton, book, bookBackButton,
    bookOut = "logbook", poisonTab, poisonTitle, bugsTab, bugsTitle, logbookTab, logbookTitle, nextPageTab, previousPageTab, pageOn = 0,
    destination, moving = false, direction = "left", cluesFound = [], clueSearchKey, keyFound = false, keyClue,
    footstep = new Howl({ src: ['audio/footstep.mp3'], loop: 1 }), pickUpKey = new Howl({ src: ['audio/pickUpKey.wav'], volume: 0.2}),
    pageTurn = new Howl({ src: ['audio/pageTurn.mp3'] }), bookClose = new Howl({ src: ['audio/bookClose.mp3'] });

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
    this.game.load.image('logbookTitle', 'images/logbookTitle.png');
    this.game.load.image('poisonTab', 'images/poisonTab.png');
    this.game.load.image('poisonTitle', 'images/poisonTitle.png');
    this.game.load.image('bugsTab', 'images/bugsTab.png');
    this.game.load.image('bugsTitle', 'images/bugsTitle.png');
    this.game.load.image('nextPageTab', 'images/nextPageTab.png');
    this.game.load.image('previousPageTab', 'images/previousPageTab.png');
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
    this.game.load.image('keyClue', 'images/keyClue.png');
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
    logbookTitle = game.add.image(1000, 300, 'logbookTitle');
    logbookTitle.visible = false;
    poisonTab = game.add.button(1580, 370, 'poisonTab', openPoison, this);
    poisonTab.rotation = -0.05;
    poisonTitle = game.add.image(1000, 250, 'poisonTitle');
    poisonTitle.visible = false;
    bugsTab = game.add.button(1605, 620, 'bugsTab', openBugs, this);
    bugsTab.rotation = -0.05;
    bugsTitle = game.add.image(1000, 300, 'bugsTitle');
    bugsTitle.visible = false;
    nextPageTab = game.add.button(1475, 775, 'nextPageTab', nextPage, this);
    previousPageTab = game.add.button(220, 770, 'previousPageTab', previousPage, this);
    nextPageTab.visible = false;
    previousPageTab.visible = false;
    book.visible = false;
    bookBackButton.visible = false;
    logbookTab.visible = false;
    poisonTab.visible = false;
    bugsTab.visible = false;
    // this group of code creates the books the player has to use

    clueSearchKey = game.add.button(860, 330, 'clueSearch_key', keyFind, this);
    clueSearchKey.visible = false;


    keyClue = game.add.button(300, 250, 'keyClue', presentKey, this);
    keyClue.visible = false;


    nextButton = game.add.button(250, 900, 'nextButton', nextScene, this);
    previousButton = game.add.button(0, 900, 'previousButton', previousScene, this);
    //these two statements are just temporary scene skippers for the demo

    game.physics.enable(constable, Phaser.Physics.ARCADE);
    game.physics.enable(corpse, Phaser.Physics.ARCADE);
    game.physics.enable(grandfather, Phaser.Physics.ARCADE);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    // these four lines enable the physics of the characters

    player.anchor.setTo(0.5, 0);
    player.body.setSize(player.width - 40, player.height - 20, 20, 20);
    grandfather.anchor.setTo(0.5, 0);
    grandfather.body.setSize(grandfather.width - 80, grandfather.height - 20, 20, 20);
    // these four lines set the anchors and sprites of the two (potentially) moving characters

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
    // these are all the declared animations for the character sprites

    if (scene != "clue search") {
        direction = "left";
    }// this if statement is just here so the player faces the body on the clue search screen
}

function keyFind() {
    clueSearchKey.visible = false;
    cluesFound[cluesFound.length] = "key";
    keyFound = true;
    pickUpKey.play();
} // this if statement hides the key and adds it to the logbook when the player picks it up

function presentKey() {
    if (scene == "confrontation") {
        closeBook();
    }
} // this function closes the book and presents the key to the suspect

function showMenu() {
    if (!paused) {
        paused = true;
        if (moving) {
            stopMoving();
        }
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
    if (moving) {
        stopMoving();
    }
} // this function resumes the game from the start menu

function startOver() {
    window.location.reload();
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
        pageTurn.play();
        if (moving) {
            stopMoving();
        }
        if (bookOut == "logbook") {
            openLogbook();
        } else if (bookOut == "poison") {
            openPoison();
        } else if (bookOut == "bugs") {
            openBugs();
        }
    }
} // this function brings up the player's books

function showPages() {
    if (bookOut == "logbook") {
        if (pageOn == 0) {
            logbookTitle.visible = true;
            keyClue.visible = false;
            poisonTitle.visible = false;
            bugsTitle.visible = false;
            nextPageTab.visible = true;
            previousPageTab.visible = false;
        } else if (pageOn == 1) {
            logbookTitle.visible = false;
            if (keyFound) {
                keyClue.visible = true;
            }
            nextPageTab.visible = true;
            previousPageTab.visible = true;
        } else if (pageOn == 2) {
            keyClue.visible = false;
            nextPageTab.visible = false;
            previousPageTab.visible = true;
        }
    } else if (bookOut == "poison") {
        if (pageOn == 0) {
            poisonTitle.visible = true;
            logbookTitle.visible = false;
            bugsTitle.visible = false;
            nextPageTab.visible = true;
            previousPageTab.visible = false;
        } else if (pageOn == 1) {
            keyClue.visible = false;
            poisonTitle.visible = false;
            nextPageTab.visible = true;
            previousPageTab.visible = true;
        } else if (pageOn == 2) {
            nextPageTab.visible = false;
            previousPageTab.visible = true;
        }
    } else if (bookOut == "bugs") {
        if (pageOn == 0) {
            bugsTitle.visible = true;
            logbookTitle.visible = false;
            poisonTitle.visible = false;
            nextPageTab.visible = true;
            previousPageTab.visible = false;
        } else if (pageOn == 1) {
            keyClue.visible = false;
            bugsTitle.visible = false;
            nextPageTab.visible = true;
            previousPageTab.visible = true;
        } else if (pageOn == 2) {
            nextPageTab.visible = false;
            previousPageTab.visible = true;
        }
    }
} // this function allows the player to effectively traverse the books and pages of said books

function nextPage() {
    pageOn++;
    showPages();
    pageTurn.play();
} // this function turns the page to the next one of whichever book the player has out

function previousPage() {
    pageOn--;
    showPages();
    pageTurn.play();
} // this function turns the page to the previous one of whichever book the player has out

function closeBook() {
    if (paused) {
        book.visible = false;
        bookBackButton.visible = false;
        logbookTab.visible = false;
        poisonTab.visible = false;
        bugsTab.visible = false;
        player.visible = true;
        logbookTitle.visible = false;
        keyClue.visible = false;
        poisonTitle.visible = false;
        bugsTitle.visible = false;
        nextPageTab.visible = false;
        previousPageTab.visible = false;
        bookClose.play();
        paused = false;
        if (moving) {
            stopMoving();
        }
    }
} // this function closes the player's books

function openLogbook() {
    bookOut = "logbook";
    logbookTab.x = 1555;
    poisonTab.x = 1580;
    bugsTab.x = 1605;
    showPages();
    if (moving) {
        stopMoving();
    }
} // this function opens the player's logbook

function openPoison() {
    bookOut = "poison";
    logbookTab.x = 1585;
    poisonTab.x = 1567;
    bugsTab.x = 1605;
    showPages();
    if (moving) {
        stopMoving();
    }
} // this function opens the book on poisons

function openBugs() {
    bookOut = "bugs";
    logbookTab.x = 1585;
    poisonTab.x = 1600;
    bugsTab.x = 1581;
    showPages();
    if (moving) {
        stopMoving();
    }
} // this function opens the book on bugs

function nextScene() {
    if (scene == "clue search") {
        scene = "confrontation";
        create();
        if (moving) {
            stopMoving();
        }
    }else if (scene == "crime scene") {
        scene = "clue search";
        create();
        if (moving) {
            stopMoving();
        }
    } else if (scene == "house") {
        scene = "crime scene";
        create();
        if (moving) {
            stopMoving();
        }
    }
    paused = false;
} // this function changes to the next scene

function previousScene() {
    if (scene == "crime scene") {
        scene = "house";
        create();
        if (moving) {
            stopMoving();
        }
    } else if (scene == "clue search") {
        scene = "crime scene";
        create();
        if (moving) {
            stopMoving();
        }
    } else if (scene == "confrontation") {
        scene = "clue search";
        create();
        if (moving) {
            stopMoving();
        }
    }
    paused = false;
} // this function changes to the previous scene, and will be removed later

function onTap(pointer) {
    if (pointer.y < 700 && scene != "clue search" && !paused) {
        destination = game.add.sprite(pointer.x, pointer.y, 'destination');
        moving = true;
        if (destination.x < player.x) {
            direction = "left";
        } else if (destination.x > player.x) {
            direction = "right";
        }
        footstep.play();
    }
} // this function spawns a 'destination' sprite when the player taps the top screen, and then sets a direction to face

function stopMoving() {
    moving = false;
    destination.destroy();
    player.body.velocity.x = 0;
    footstep.stop();
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
        if (!keyFound) {
            clueSearchKey.visible = true;
        }
        if (paused) {
            clueSearchKey.visible = false;
        }
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
    } // this if statement checks for on-screen taps to start the player moving

    if (book.visible == true && nextPageTab.visible == false && previousPageTab.visible == false) {
        bookOut = "logbook";
        pageOn = 0;
        showPages();
    } // don't ask why this is here, just leave it here and everything will be fine

    if (!moving) {
        footstep.stop();
    }
}

function render() {
    
}

