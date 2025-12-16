console.log("MAIN JS LOADED");

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: "#0f1021",
  scene: []
};

const game = new Phaser.Game(config);

// Add scenes AFTER game is created
game.scene.add("BootScene", BootScene);
game.scene.add("GameScene", GameScene);
game.scene.add("EndScene", EndScene);

// Start game
game.scene.start("BootScene");
