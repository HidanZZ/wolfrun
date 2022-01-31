import Phaser from "phaser";
import config from '../config';
import { sceneEvents } from '../objects/EventCenter'

export default class Wolf extends Phaser.GameObjects.Sprite {
started: boolean=false;
scene:any;
jumpCount:number;
dropCount:number;
keys:any;
dead:boolean = false;
	constructor(scene, x, y) {
		super(scene, x, y, 'wolf_idle');
        this.flipX=true;
        this.scene=scene;
        this.setDepth(10)
        this.jumpCount=2;
        this.createAnims()
        this.dead=false;
         this.keys = scene.input.keyboard.addKeys({
            space: 'SPACE',
            a: 'A',
            s: 'S',
            w: 'W',
          });
      
         
    //    this.anims.play('explo')
        sceneEvents.on('started', (start) => {
                this.started=start;
                if (start) {
                    this.keys.space.on('down', this.speedup, this);
                    this.keys.w.on('down', this.jump, this);
                    this.keys.s.on('down', this.instaDrop, this);
                   
                }
        })
		
	}
    setDead(){
        this.dead=true;
        
    }
    preUpdate(t: number,dt: number) {
        super.preUpdate(t,dt);
        if (!this.started) {
            
            this.anims.play('idle',true)
        }else{
            this.anims.play('run',true)
            if (this.body.touching.down) {
                this.jumpCount=2
            }
            if (this.x<120  ) {
          
            
                this.body.setGravityX(0)
                this.body.setVelocityX(0)
               
            }
            if (this.x>400) {
                this.body.setVelocityX(0)
                
            }
        }
        
        
        
    }
    
    jump(){
        if (this.jumpCount>0 && !this.dead) {
            this.body.setVelocityY(-150)
            this.jumpCount-=1
        }
        
       
    } 
    speedup(){
        if (!this.dead) {
            if (this.x<120) {
                this.x+=1
            }
            this.body.setVelocityX(70)
            this.body.setGravityX(-50)
        }
      
       
    }
    instaDrop() {
        if (!this.dead) {
            if ((this.started) && (!this.body.touching.down || (this.dropCount > 0 ))) {
                if (this.body.touching.down) {
                  this.dropCount = 0;
                }
                this.body.setVelocityY(150);
                this.dropCount += 1;
              }
        }
       
      }
    createAnims() {
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('wolf_run', {

                start: 0,
                end: 5,
            }),
            frameRate: 15,
            
        });
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('wolf_idle', {

                start: 0,
                end: 5,
            }),
            frameRate: 7,
            
        });
    }
}