import Phaser from "phaser";
import { sceneEvents } from '../objects/EventCenter'

export default class Background  {
    add:Phaser.GameObjects.GameObjectFactory;
    bg1:Phaser.GameObjects.TileSprite;
    bg2:Phaser.GameObjects.TileSprite;
    bg3:Phaser.GameObjects.TileSprite;
    bg4:Phaser.GameObjects.TileSprite;
   
    constructor(add:Phaser.GameObjects.GameObjectFactory){
            this.add=add;
           
    }
    create(){
          this.bg1 = this.add.tileSprite(0,
            0,
            0,
            0,
            'bg1'
        ).setOrigin(0, 0).setDepth(0); 
        this.bg2 = this.add.tileSprite(0,
            0,
            0,
            0,
            'bg2'
        ).setOrigin(0, 0).setDepth(1); 
        this.bg3 = this.add.tileSprite(0,
            0,
            0,
            0,
            'bg3'
        ).setOrigin(0, 0).setDepth(3); 
        this.bg4 = this.add.tileSprite(0,
            0,
            0,
            0,
            'bg4'
        ).setOrigin(0, 0).setDepth(5);
        
    }
   update(start:boolean) {
    if (start) {
        this.bg3.tilePositionX+=0.4
        this.bg4.tilePositionX+=0.8
    }
   }
}
 