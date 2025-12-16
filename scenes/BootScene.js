class BootScene extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
  console.log("BOOT PRELOAD START");

  this.load.image("clock", "assets/images/clock.png");

  this.load.on("filecomplete-image-clock", () => {
    console.log("CLOCK IMAGE LOADED SUCCESSFULLY");
  });

  this.load.on("loaderror", (file) => {
    console.error("FAILED TO LOAD:", file.src);
  });
}

  create() {
    console.log("BOOT SCENE RUNNING");

    // Go to main game after short delay
    this.time.delayedCall(800, () => {
      this.scene.start("GameScene");
    });
  }
}
