var game = new Phaser.Game(1800, 1000, Phaser.AUTO, null, { preload: preload, create: create, update: update });
var player, door, menuButton, booksButton;

function preload() {
    this.game.load.image('house_background', 'images/house_background.png');
    this.game.load.image('dialogueBox', 'images/dialogueBox.png');
    this.game.load.image('menuButton', 'images/menuButton.png');
    this.game.load.image('booksButton', 'images/booksButton.png');
    this.game.load.spritesheet('player', 'images/player.png', 150, 150);

}

function create() {
    this.game.add.image(0, 0, 'house_background');
    this.game.add.image(0, 700, 'dialogueBox');
    menuButton = game.add.image(1725, 630, 'menuButton');
    booksButton = game.add.image(1635, 630, 'booksButton');
    player = game.add.sprite(1000, 450, 'player')
}

function update() {

}