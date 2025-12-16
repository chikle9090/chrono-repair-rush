class GameScene extends Phaser.Scene {
  constructor() {
    super();
  }

  init() {
    this.timeLeft = 90;

    // Clock puzzle
    this.clockSolved = false;
    this.clockRewinds = 0;

    // Plant puzzle
    this.plantSolved = false;
    this.plantGrowth = 0;

    // Freeze puzzle
    this.freezeSolved = false;
  }

  create() {
    // ================= BACKGROUND =================
    this.add.rectangle(480, 270, 960, 540, 0x1e1f3b);

    // ================= TITLE =================
    this.add.text(30, 20, "⏳ Fix Time Before It Collapses", {
      fontSize: "20px",
      color: "#ffffff"
    });

    // ================= TIMER =================
    this.timerText = this.add.text(820, 20, "90", {
      fontSize: "28px",
      color: "#00ffcc"
    });

    // ================= CLOCK PUZZLE =================
    this.clock = this.add.rectangle(200, 300, 100, 100, 0xffc857)
      .setInteractive({ useHandCursor: true });

    this.clock.on("pointerdown", () => {
      if (this.clockSolved) return;

      this.clockRewinds++;
      this.timeLeft += 2;
      this.timerText.setText(this.timeLeft);

      this.clock.setScale(0.9);
      this.time.delayedCall(100, () => this.clock.setScale(1));

      if (this.clockRewinds >= 5) {
        this.solveClock();
      }
    });

    this.add.text(160, 420, "Clock", { color: "#fff" });

    // ================= PLANT PUZZLE =================
    this.plant = this.add.rectangle(380, 320, 40, 40, 0x2ecc71)
      .setInteractive({ useHandCursor: true });

    this.plant.on("pointerdown", () => {
      if (this.plantSolved) return;

      this.plantGrowth++;

      this.tweens.add({
        targets: this.plant,
        scaleX: this.plantGrowth + 1,
        scaleY: this.plantGrowth + 1,
        duration: 200,
        ease: "Back.easeOut"
      });

      this.timeLeft += 1;
      this.timerText.setText(this.timeLeft);

      if (this.plantGrowth >= 4) {
        this.solvePlant();
      }
    });

    this.add.text(350, 420, "Plant", { color: "#fff" });

    // ================= FREEZE PUZZLE =================
    this.freezeZone = this.add.rectangle(740, 300, 40, 120, 0x00ffcc);
    this.freezeMover = this.add.rectangle(740, 300, 20, 20, 0xffffff)
      .setInteractive({ useHandCursor: true });

    this.freezeTween = this.tweens.add({
      targets: this.freezeMover,
      x: 700,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    this.freezeMover.on("pointerdown", () => {
      if (this.freezeSolved) return;

      this.freezeTween.pause();

      if (Math.abs(this.freezeMover.x - this.freezeZone.x) < 20) {
        this.solveFreeze();
      } else {
        this.time.delayedCall(300, () => {
          this.freezeTween.resume();
        });
      }
    });

    this.add.text(705, 420, "Freeze", { color: "#fff" });

    // ================= TIMER LOGIC =================
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeLeft--;
        this.timerText.setText(this.timeLeft);

        if (this.timeLeft <= 10) {
          this.timerText.setColor("#ff4d4d");
        } else if (this.timeLeft <= 30) {
          this.timerText.setColor("#ffcc00");
        }

        if (this.timeLeft <= 0) {
          this.scene.start("EndScene", {
            message: "⏳ Time Collapsed"
          });
        }
      },
      loop: true
    });
  }

  // ================= SOLVERS =================
  solveClock() {
    this.clockSolved = true;
    this.clock.disableInteractive();
    this.clock.setFillStyle(0x00ffcc);

    this.add.text(140, 260, "✔ Fixed", {
      fontSize: "18px",
      color: "#ff1100ff"
    });

    this.checkWinCondition();
  }

  solvePlant() {
    this.plantSolved = true;
    this.plant.disableInteractive();
    this.plant.setFillStyle(0x00ff99);

    this.add.text(
      this.plant.x,
      this.plant.y - 70,
      "🌱 Grown",
      {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#1e1f3b",
        padding: { x: 8, y: 4 }
      }
    ).setOrigin(0.5).setDepth(10);

    this.checkWinCondition();
  }

  solveFreeze() {
    this.freezeSolved = true;
    this.freezeTween.stop();
    this.freezeMover.disableInteractive();

    this.freezeZone.setFillStyle(0x00ff99);
    this.freezeMover.setFillStyle(0x00ff99);

    this.timeLeft += 5;
    this.timerText.setText(this.timeLeft);

    this.add.text(705, 260, "❄ Frozen", {
      fontSize: "16px",
      color: "#005effff"
    });

    this.checkWinCondition();
  }

  // ================= WIN CHECK =================
  checkWinCondition() {
    if (this.clockSolved && this.plantSolved && this.freezeSolved) {
      this.timerEvent.remove(false);

      this.scene.start("EndScene", {
        message: "🎉 Time Restored!"
      });
    }
  }
}
