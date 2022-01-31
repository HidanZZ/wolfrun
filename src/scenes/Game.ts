import Phaser from 'phaser';
import Background from '../objects/Background';
import Wolf from '../objects/Wolf';
import { sceneEvents } from '../objects/EventCenter'
import Explosion from '../objects/Explosion';
import Highscore from '../objects/Highscore';

export default class Demo extends Phaser.Scene {
  background: Background;
  floor: Phaser.GameObjects.TileSprite;
  wolf:Phaser.GameObjects.Sprite;
  gas:Phaser.Physics.Arcade.Collider;
  platformGroup:Phaser.GameObjects.Group;
  platformPool:Phaser.GameObjects.Group;
  spikeGroup:Phaser.GameObjects.Group;
  spikePool:Phaser.GameObjects.Group;
  floorSpikeGroup:Phaser.GameObjects.Group;
  spikeCollider:Phaser.Physics.Arcade.Collider;
  floorSpikeCollider:Phaser.Physics.Arcade.Collider;
  platfromCollider:Phaser.Physics.Arcade.Collider;
  spikeFloor:Phaser.Time.TimerEvent;
  platformAdded:number;
  spikeAdded:number;
  nextPlatformDistance:number;
  particles:Phaser.GameObjects.Particles.ParticleEmitterManager;
  emitter:Phaser.GameObjects.Particles.ParticleEmitter;
  UIContainer:Phaser.GameObjects.Container;
  gameOverContainer:Phaser.GameObjects.Container;
  scoreCounter:Phaser.Time.TimerEvent;
  score:number = 0;
  scoreText:Phaser.GameObjects.Text;
  userInput:Phaser.GameObjects.DOMElement
  username:string|null;
  uinput:HTMLInputElement|null;
  error:Phaser.GameObjects.Text;
  gameoverText:Phaser.GameObjects.Text;
  highscoreContainer:Highscore;
  highscoreVisible:boolean = false;
  highscoreButton:Phaser.GameObjects.Image;
  started: boolean = false;
  data:any ;
  constructor() {
    super('GameScene');
  }

  preload() {
    
  }
init(data:any) {
  this.data=data
}
  create() {
    this.started=false;
    this.platformAdded=0;
    this.spikeAdded=0;
    this.background=new Background(this.add);
    this.background.create();
    this.createFloor()
    this.createWolf()
    this.setColliders()
    this.createUI()
    this.createHighscores()
    
    let d=(event) => {
      if(event.code=='Space'){
        if (!this.highscoreVisible) {
          this.input.keyboard.removeListener('keydown',d)
          this.tweens.add({
            targets: this.UIContainer,
            y:-1.5*this.scale.height, // '+=100'
            // ease: "Back", // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1500,
            repeat: 0,
            // yoyo: true,
            onComplete:this.createExplosion(this)
            })
        }
       
       
      }}
    this.input.keyboard.on('keydown',d )
    
   
    
    
  }
  createGameOver(){
    this.UIContainer = this.add.container(this.scale.width/2, this.scale.height).setDepth(999);
  }
  createUI() {
    this.UIContainer = this.add.container(this.scale.width/2, this.scale.height/5).setDepth(999);
    let logo=this.add.image(0,0,'logo').setDepth(999)
    let text=this.add.text(0,100,'Press Space to Start',{
      fontFamily:'super',
      fontSize:'25px',
      color:'white'
    }).setOrigin(0.5)
    this.tweens.add({
      targets: text,
      alpha: 0, // '+=100'
      // ease: "Back", // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 800,
      repeat: -1,
      yoyo: true,
      })
    this.UIContainer.add(logo)
    this.UIContainer.add(text)
  }
  createFloor(){
    this.floor= this.add.tileSprite(0,this.scale.height-30,0,0,'floor').setOrigin(0).setDepth(20)
    this.physics.add.existing(this.floor,true)
    this.floor.body.setSize(this.floor.width,this.floor.height*0.9)
}
updateFloor(){
  if (this.started) {
    this.floor.tilePositionX+=1.6
  }
}
createPlatforms(){
  this.platformGroup = this.add.group({
    removeCallback: (platform) => {
      platform.scene.platformPool.add(platform);
    },
  });

  this.platformPool = this.add.group({
    removeCallback: (platform) => {
      platform.scene.platformGroup.add(platform);
    },
  });
  const randomPlatformWidth = Phaser.Math.Between(60, 150);

    const randomPlatformHeight = Phaser.Math.Between(190, 190);

    this.addPlatform(this.scale.width, randomPlatformHeight, randomPlatformWidth);
    this.spikeGroup = this.add.group({
      removeCallback: (spike) => {
        spike.scene.spikePool.add(spike);
      },
    });

    this.spikePool = this.add.group({
      removeCallback: (spike) => {
        spike.scene.spikeGroup.add(spike);
      },
    });
    this.spikeCollider = this.physics.add.collider(this.wolf, this.spikeGroup, (wolf,spike) => {
      if (wolf.body.touching.down && spike.body.touching.up) {
        this.spikeCollider.active=false;
        wolf.setDead()
        wolf.destroy();
        this.dead()
      }
    }); 
    this.platfromCollider = this.physics.add.collider(this.wolf, this.platformGroup, () => {
     
    });
    this.spikeFloor = this.time.addEvent({
      delay: Phaser.Math.Between(3000,6000),
      callback: () => {
        this.spawnSpike();
      },
      callbackScope: this,
    });

    this.floorSpikeGroup = this.add.group();

    this.floorSpikeCollider = this.physics.add.collider(this.wolf, this.floorSpikeGroup, (wolf,spike) => {
        if (wolf.body.touching.down && spike.body.touching.up) {
          this.floorSpikeCollider.active=false;
        wolf.setDead()

          wolf.destroy();
          this.dead()
        }
    });

}
addPlatform(posX, posY, platformWidth) {
  this.platformAdded += 1;
  let platform;
  console.log(this.platformAdded);
  
  if (this.platformPool.getLength()) {
    console.log('here');
    
    platform = this.platformPool.getFirst();
    platform.x = posX;
    platform.y = posY;
    platform.active = true;
    platform.visible = true;
    this.platformPool.remove(platform);
    platform.displayWidth = platformWidth;
    platform.tileScaleX = 1 / platform.scaleX;
  } else {
    platform = this.add.tileSprite(posX, posY, platformWidth, 20, 'floor').setDepth(99);
    this.physics.add.existing(platform);
    platform.body.setImmovable();
    platform.body.setVelocityX(-100);
    platform.body.setFrictionX(0);
    platform.body.setSize(platform.body.width, platform.body.height - 10);
    this.platformGroup.add(platform);
  }
  console.log(this.platformGroup);
  
  this.nextPlatformDistance = Phaser.Math.Between(80, 300);

  if (this.platformAdded > 1) {
    if (Phaser.Math.Between(1, 100) <= 25) {
      if (this.spikePool.getLength()) {
        const spike = this.spikePool.getFirst();
        spike.x = posX - platform.body.width / 2 + Phaser.Math.Between(1, platform.body.width - 56);
        spike.y = posY - platform.body.height / 2;
        spike.active = true;
        spike.visible = true;
        this.spikePool.remove(spike);
      } else {
        const spike = this.physics.add.sprite(posX - platform.body.width / 2 + Phaser.Math.Between(1, platform.body.width - 56), posY - platform.body.height / 2, 'spike').setOrigin(0, 1).setDepth(98).setScale(0.5);
        spike.setImmovable();
        spike.setVelocityX(platform.body.velocity.x);
        this.spikeGroup.add(spike);
      }
    }
  }
}

platformSpawner() {
  let minDistance = this.scale.width;
  this.platformGroup.getChildren().forEach(platform => {
    const platformDistance = minDistance - platform.x - platform.displayWidth / 2;
    if (platformDistance < minDistance) {
      minDistance = platformDistance;
    }
    if (platform.x < -platform.displayWidth / 2) {
      this.platformGroup.killAndHide(platform);
      this.platformGroup.remove(platform);
    }
  }, this);

  if (minDistance > this.nextPlatformDistance) {
    const nextPlatformWidth = Phaser.Math.Between(60,150);

    let platformRandomHeight;
    if (this.platformAdded === 0) {
      platformRandomHeight = Phaser.Math.Between(90, 200);
    } else {
      platformRandomHeight = Phaser.Math.Between(50, 200);
    }

    this.addPlatform(this.scale.width + nextPlatformWidth / 2, platformRandomHeight, nextPlatformWidth);
  }
}

spawnSpike() {
  if (Phaser.Math.Between(1, 100) <= 50 && this.started) {
    this.spikeAdded += 1;
  const h = this.textures.get('spike').getSourceImage().height;

  const floorSpike = this.add.tileSprite(this.scale.width, this.scale.height-40, 56 * Phaser.Math.Between(1,2), h, 'spike').setDepth(19).setScale(0.5);

  this.physics.add.existing(floorSpike);
  floorSpike.body.setImmovable();
  floorSpike.body.setVelocityX(-96);
  this.floorSpikeGroup.add(floorSpike);
  }
  
  this.spikeFloor.reset({ delay: Phaser.Math.Between(3000,6000), callback: this.spawnSpike, callbackScope: this, repeat: 1});
}
createExplosion(this){
  this.highscoreButton.destroy()
  let explo = this.add.group({
    classType:Explosion,
  });

  for (var i = 0; i < 10; i++)
  {
      //  This creates a new Phaser.Sprite instance within the group
      //  It will be randomly placed within the world and use the 'baddie' image to display
      explo.create();
  }
  this.cameras.main.shake(4000, 0.02)
  this.cameras.main.on(Phaser.Cameras.Scene2D.Events.SHAKE_COMPLETE, () => {
    // explo.clear(true,true)
    this.started=true
    
    this.createParticles()
    this.createPlatforms()
    this.score=0
this.wolf.body.setGravityX(-50)
this.scoreText=this.add.text(this.scale.width-10,10,`SCORE: ${this.score}`,{ 
  fontFamily:'super', 
fontSize:'16px',
color:'white'}
).setOrigin(0).setDepth(999)
this.scoreCounter = this.time.addEvent({
  delay: 500,
  callback: () => {
      this.score += 1;
  },
  callbackScope: this,
  loop: true,
});
    
  })

}
createWolf(){
this.wolf=new Wolf(this,this.scale.width/2,this.scale.height-64)
this.add.existing(this.wolf)
this.physics.add.existing(this.wolf)
this.wolf.body.setGravityY(150)
this.wolf.body.setSize(this.wolf.width*0.65,this.wolf.height*0.55)
this.wolf.body.setOffset(this.wolf.width*0.2,this.wolf.height*0.45)
}
createParticles(){
  var rect = new Phaser.Geom.Rectangle(0,0,40,this.scale.height);
   this.particles = this.add.particles('gas').setDepth(111);

    
   this.emitter=this.particles.createEmitter({
        frame: [ 16 ],
          x: 0,
          y: { min: -5, max: 280 },
          speed: 300,
          tint:[0xffff00, 0xff0000, 0x00ff00, 0x0000ff],
          gravityY: 0,
          lifespan: 1000,
          // scale: 0.4,
          quantity: 19,
          blendMode: 'ADD',
          deathZone: { type: 'onLeave', source: rect }
      });
      
  var deathZone = this.add.rectangle(0,0,25,this.scale.height,0x000000,0).setOrigin(0);
  this.physics.add.existing(deathZone,true)
  // deathZone.body.setImmovable(true);
  this.gas=this.physics.add.collider(this.wolf,deathZone,()=>{
    console.log('dead');
    this.gas.active=false
    this.dead()
    
  });
    
}
createHighscores() {
  let username = localStorage.getItem('username')
  this.highscoreVisible=false;
  this.highscoreContainer = new Highscore(this, 500,0,username,this.data.score).setDepth(9999)
  this.add.existing(this.highscoreContainer)
  this.highscoreButton=this.add.image(this.scale.width-30,20,'high').setDepth(999).setScale(2).setInteractive({ useHandCursor: true }).on('pointerdown',()=>{
    if (this.highscoreVisible) {
      this.highscoreVisible=false
      this.tweens.add({
        targets: this.highscoreContainer,
        x: 500, // '+=100'
        ease: "Cubic", // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 1000,
        repeat: 0,
        yoyo: false,
        onComplete:()=>{
          
        }
        });
        
    }else{
      this.highscoreVisible=true
      this.tweens.add({
        targets: this.highscoreContainer,
        x: 0, // '+=100'
        ease: "Cubic", // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 1000,
        repeat: 0,
        yoyo: false,
        onComplete:()=>{

        

        }
        });

       
    }
     
  })
}
dead(){
  this.scoreCounter.destroy()
  sceneEvents.emit('gameOver',true)
  var rect = new Phaser.Geom.Rectangle(0,0,480,this.scale.height);
    this.started=false;
    // this.particles.removeEmitter(this.emitter)
     
      this.emitter=this.particles.createEmitter({
        frame: [ 16 ],
          x: 0,
          y: { min: -5, max: 280 },
          speedX: 300,
          tint:[0xffff00, 0xff0000, 0x00ff00, 0x0000ff],
          gravityY: 0,
          lifespan: 10000,
          // scale: 0.4,
          quantity: 19,
          blendMode: 'ADD',
          deathZone: { type: 'onLeave', source: rect }
      });
      this.time.delayedCall(5000,()=>{
        let gametemp=this.add.text(this.scale.width/2,550,'Game Over',{ 
          fontFamily:'super', 
        fontSize:'22px',
        color:'white'}).setOrigin(0.5).setDepth(999)
        this.gameoverText=this.add.text(this.scale.width/2,600,'Press Enter to continue',{ 
          fontFamily:'super', 
        fontSize:'22px',
        color:'white'}).setOrigin(0.5).setDepth(999)
        this.input.keyboard.disableGlobalCapture()
        let value = localStorage.getItem('username')? 'value="'+localStorage.getItem('username')+'"':''
        this.userInput = this.add.dom(this.scale.width/2,700).createFromHTML('<input class="playerInput" '+value+' type="text" placeholder="Username" name="player">').setDepth(66).setOrigin(0.5);
        this.uinput = document.querySelector('input');
        
        this.uinput?.addEventListener('input',()=>{
          if(this.error) this.error.destroy()
        })
        this.input.keyboard.on('keydown', (event) => {
          if(event.code=='Enter'){
            console.log('enter');
            
            if (!this.started) {
              this.inputCheck()
            }
          }})
        this.tweens.add({
          targets: this.userInput,
          y: this.scale.height-60, // '+=100'
          ease: "Cubic", // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 1000,
          repeat: 0,
          yoyo: false
          });
        this.tweens.add({
          targets: this.particles,
          y: -1.5*this.scale.height, // '+=100'
          ease: "Cubic", // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 1000,
          repeat: 0,
          yoyo: false
          })
          this.tweens.add({
            targets: this.gameoverText,
            y: this.scale.height/2, // '+=100'
            ease: "Cubic", // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0,
            yoyo: false
            })  
            
          this.tweens.add({
            targets: gametemp,
            y: this.scale.height/2-50, // '+=100'
            ease: "Cubic", // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0,
            yoyo: false
            })
         


      })

}
inputCheck () {
  var letterNumber = /^(?=[a-zA-Z0-9._]{4,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
 if (this.username) {
  this.cameras.main.fadeOut(1000, 0, 0, 0);
  this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
    this.scene.start('GameScene',{score: this.score});
  });
 }else{
  if (this.uinput?.value.trim() === "") {
    this.showError('Username cannot be empty')
} else if (!this.uinput?.value.match(letterNumber)) {
    this.showError('invalid username')
} else {
    // if (error) error.destroy()
    
    localStorage.setItem('username', this.uinput.value.trim())
     this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.start('GameScene',{score: this.score});
      });
    
  
}
 }
  }
showError(text:string) {
  if (this.error) this.error.destroy()
  this.error = this.add.text(this.scale.width/2,this.scale.height-100,text,{
    fontFamily:'super', 
    fontSize:'16px',
    color:'red'
  }).setOrigin(0.5).setDepth(99)
}
setColliders(){
  this.physics.add.collider(this.wolf,this.floor)
}
objectRemove() {
  this.spikeGroup.getChildren().forEach(spike => {
    if (spike.x < -spike.displayWidth / 2) {
      this.spikeGroup.killAndHide(spike);
      this.spikeGroup.remove(spike);
    }
  }, this);

  this.floorSpikeGroup.getChildren().forEach(spike => {
    if (spike.x < -spike.displayWidth / 2) {
      this.floorSpikeGroup.remove(spike);
      spike.destroy();
    }
  }, this);

 
}
update(time: number, delta: number) {
    sceneEvents.emit('started',this.started)
    this.background.update(this.started)
    this.updateFloor()
    if (this.started) {
      this.objectRemove();
      this.scoreText.setText(`SCORE: ${this.score}`);

      this.scoreText.x = this.scale.width - this.scoreText.width - 30;
      this.platformSpawner();
    }
  
}

}
