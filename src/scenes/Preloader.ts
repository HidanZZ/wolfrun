import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
  
    this.load.image('bg1', 'assets/background/fire/parallax-demon-woods-bg.png');
    this.load.image('bg4', 'assets/background/fire/parallax-demon-woods-close-trees.png');
    this.load.image('bg3', 'assets/background/fire/parallax-demon-woods-mid-trees.png');
    this.load.image('bg2', 'assets/background/fire/parallax-demon-woods-far-trees.png');
    this.load.image('floor', 'assets/platform.png');
    this.load.image('spike', 'assets/spike.png');
    this.load.image('logo', 'assets/logo.png');
    this.load.image('leader', 'assets/leader.png');
    this.load.image('high', 'assets/high.png');
    
    this.load.spritesheet('wolf_run', 'assets/wolf/run.png',{frameWidth:64,frameHeight:64});
    this.load.spritesheet('wolf_idle', 'assets/wolf/idle.png', {frameWidth:64,frameHeight:64});
    this.load.spritesheet('explosion', 'assets/explo/explosion.png', {frameWidth:100,frameHeight:100});
    this.load.spritesheet('gas', 'assets/explo/gas.png', {frameWidth:64,frameHeight:64});

  }

  create() {
      this.scene.start('GameScene')
  }
}
