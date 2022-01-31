import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/Game';
import Preloader from './scenes/Preloader';
function loadFont(name: string, url: string) {
  var newFont = new FontFace(name, `url(${url})`);
  newFont.load().then(function (loaded) {
      document.fonts.add(loaded);
  }).catch(function (error) {
      return error;
  });
}

loadFont('super', 'assets/super.ttf');
new Phaser.Game(
  Object.assign(config, {
    scene: [Preloader,GameScene]
  })
);
