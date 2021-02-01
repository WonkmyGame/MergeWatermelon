import GameManager from "./GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FruitGailv extends cc.Component {

    // @property(cc.Graphics)
    // draw: cc.Graphics = null;

    @property(cc.Node)
    nodeList: cc.Node[] = [];
    Blue = 0;
    Red = 0;
    Green=0;
    yellow=0;
    start() {
        GameManager.gailvList.push(60);
        GameManager.gailvList.push(20);
        GameManager.gailvList.push(10);
        GameManager.gailvList.push(5);
        GameManager.gailvList.push(5);
        console.log(GameManager.gailvList);
        this.test();
    }
    /**
 * 根据概率表产生一个概率下标
 * @param arg_ProbabilityTable  - 概率表--单位为%
 * @return
 *  概率表下标
 */
    makeProbabilityValues(arg_ProbabilityTable) {
        let i=0;
        let randomValue = this.myrandom(0, 101);
        for (i = 0; i < arg_ProbabilityTable.length; i++) {
            if (randomValue <= arg_ProbabilityTable[i]) {
                return i;
            }
            randomValue -= arg_ProbabilityTable[i];
        }
        return arg_ProbabilityTable.length;
    }

    myrandom(lower:number, upper:number) {
        return Math.floor(Math.random() * (upper - lower)) + lower;
    }

    test(){
        for (let i = 0; i < 10000; i++){
            var index=this.makeProbabilityValues(GameManager.gailvList);
            //console.log(index);
            let name= this.nodeList[index].name;
            switch(name)
            {
                case "Blue":
                    this.Blue++;
                    break;
                case "Red":
                    this.Red++;
                    break;
                case "Green":
                    this.Green++;
                    break;
                case "yellow":
                    this.yellow++;
                    break;
            }
        }
       
       console.log("Blue:" + this.Blue + "Red:" + this.Red+"Green:"+this.Green+"yellow"+this.yellow);
    }
    
}