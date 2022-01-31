import Phaser from "phaser";
import config from '../config';
import { sceneEvents } from './EventCenter'

export default class Explosion extends Phaser.GameObjects.Sprite {
    started: boolean = false;
    gameOver: boolean = false;
	constructor(scene) {
        let x=Phaser.Math.Between(60,420)
        let y=Phaser.Math.Between(60,200)
		super(scene, x, y, 'explosion',0);
       let depth=[2,4]
       this.setScale(1.5)
        this.setDepth(depth[Phaser.Math.Between(0,1)])
        this.createAnims()

       this.anims.play('explo')
       scene.cameras.main.flash(200)
       sceneEvents.on('started', (start) => {
        this.started=start;
}) 
sceneEvents.on('gameOver', (over) => {
        this.gameOver = over;
})
       this.on('animationstart',()=>{
           if (!this.started && !this.gameOver) {
        scene.cameras.main.flash(200)
               
           }
       })
       this.on('animationcomplete', ()=>{ 
        let resetTimer=()=>{
            let x=Phaser.Math.Between(60,460)
            let y=Phaser.Math.Between(60,200)
            this.setDepth(depth[Phaser.Math.Between(0,1)])
            this.setPosition(x,y)
           this.anims.play('explo')
                time.reset({ delay: Phaser.Math.Between(0,500), callback: resetTimer, callbackScope: scene, repeat: 1});
        }
       let time= scene.time.addEvent({
            delay: Phaser.Math.Between(0,500),
            callback: resetTimer,
            repeat: 1,
            callbackScope: this
        })
        
        
        


}, this);
      
		
	}
    preUpdate(t: number,dt: number) {
        super.preUpdate(t,dt);
        
        
    }
    
    
   
    createAnims() {
        this.anims.create({
            key: 'explo',
            frames: this.anims.generateFrameNumbers('explosion', {

                start: 0,
                end: 63,
            }),
            frameRate: 60,
            
        });
       
    }
}