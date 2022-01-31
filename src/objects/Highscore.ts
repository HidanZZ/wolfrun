import Phaser from "phaser";

export default class Highscore extends Phaser.GameObjects.Container {
    // private url: string = '';
    static url: string= `https://api-hidanz.herokuapp.com/user/wolf/`;
    private bg :Phaser.GameObjects.Image
    private widthBg :number

    constructor(scene: Phaser.Scene, x: number, y: number,username?:string|null,score?:number) {
        super(scene, x, y);
         this.bg = this.scene.add.image(0,0, 'leader').setDepth(4).setOrigin(-0.16,0.12).setScale(0.3)
         this.widthBg=this.bg.width*0.4
        //  let textScene = this.scene.add.text(this.bg.width *1.5/ 2, this.bg.height*1.5-70, 'Highscores', {
        //     fontFamily: 'super',
        //     fontSize: '70px',
        //     color: '#FFFFFF',
        // }).setDepth(4).setOrigin(0.5)
        this.add([this.bg])
        let result = null;
        if (username && score) {
            result=this.postScore(username,score)
        }else{
            result=this.getScores()
        }
        result.then((result: any[]) => {
            let prevRank;
            let prevName;
            let prevScore;

            for (let i = 0; i <= 9; i += 1) {
                const {
                    name,
                    score
                } = result[i];
                
                const rank = this.rankText((i + 1).toString());
                const name1 = this.nameText(name);
                const scoreN = this.scoreText(score);
                this.add([rank, name1, scoreN])

                if (i >= 1) {
                    rank.y = prevRank.y + 18;
                    name1.y = prevName.y + 18;
                    scoreN.y = prevScore.y + 18;
                }

                prevRank = rank;
                prevName = name1;
                prevScore = scoreN;
            }

           
        });
        
    }

   
    async getScores(): Promise {
        return new Promise((resolve, reject) => {
            var scoreArray = [];

            fetch(Highscore.url, {
                    mode: 'cors'
                })
                .then(result => result.json())
                .catch(error => {
                    reject(error);
                })
                .then((result) => {
                    result.forEach((res) => {
                        const name = res.name
                        const score = res.score
                        scoreArray.push({
                            name,
                            score
                        });
                    });
                    const scoreSorted = scoreArray.sort((a, b) => {
                        a = parseInt(a.score, 10);
                        b = parseInt(b.score, 10);
                        if (a < b) {
                            return 1;
                        }
                        if (a > b) {
                            return -1;
                        }
                        return 0;
                    });

                    resolve(scoreSorted);
                });
        });
    }


    rankText(rank: string) {
        return this.scene.make.text({
            x: this.widthBg-310,
            y:90,
            text: rank + ' - ',
            style: {
                // fontStyle:'strong',
                fontSize: '10px',
                color: '#fff',
                fontFamily: 'super',
            },
        }).setOrigin(0.5, 0.5).setDepth(99);
    }

    nameText(player: string) {
        return this.scene.make.text({
            x: this.widthBg-250,
            y:90,
            text: player,

            style: {
                // fontStyle:'strong',
                fontSize: '10px',
                color: '#fff',
                fontFamily: 'super',
            },
        }).setOrigin(0.5, 0.5).setDepth(99);
    }

    scoreText(score: string) {
        return this.scene.make.text({
            x: this.widthBg-180,
            y:90,
            text: score,
            style: {
                // fontStyle:'strong',
                fontSize: '10px',
                color: '#fff',
                fontFamily: 'super',
            },
        }).setOrigin(0.5, 0.5).setDepth(99);
    }
    
    public postScore(player, score) {
        return new Promise((resolve, reject) => {
            const entry = {score: score};
      
            fetch(Highscore.url  + player, {
                method: 'PATCH',
                mode: 'cors',
                headers: {'Content-type': 'application/json;charset=UTF-8'},
                body: JSON.stringify(entry),
            })
                .then((result) => {
                    localStorage.removeItem('score')
                    if (result.ok) return result.json();
                    throw new Error('An error ocurred');
                })
                .catch((error) => {
                    reject(error);
                }).then(() => resolve(this.getScores()));
        });
      }
}