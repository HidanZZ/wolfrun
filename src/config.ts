import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  scale: {
    width: 480,
    height: 272,
    zoom:2,
    // mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
    
  },
  dom: {
    createContainer: true,
  },
};
