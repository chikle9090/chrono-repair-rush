class EndScene extends Phaser.Scene {
  constructor() {
    super();
  }

  init(data) {
    this.message = data.message || "Game Over";
  }

  create() {
    this.add.rectangle(480, 270, 960, 540, 0x000000);

    this.add.text(480, 270, this.message, {
      fontSize: "36px",
      color: "#ffffff"
    }).setOrigin(0.5);
  }
}
