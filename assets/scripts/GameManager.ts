// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { FaynUtils } from "./FaynUtils";
import Fruits from "./Fruits";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    @property(cc.SpriteFrame)
    fruitsListSprite: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    effectSprite: cc.SpriteFrame = null;

    @property(cc.Node)
    fruitSpwanPos: cc.Node = null;

    public static gailvList=[];

    public static canSpwan=false;

    public static score=0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getCollisionManager().enabled=true;
        cc.director.getPhysicsManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
        GameManager.gailvList.push(60);
        GameManager.gailvList.push(20);
        GameManager.gailvList.push(10);
        GameManager.gailvList.push(6);
        GameManager.gailvList.push(4);
        GameManager.gailvList.push(0);
        GameManager.gailvList.push(0);
        GameManager.gailvList.push(0);
        GameManager.gailvList.push(0);
        GameManager.gailvList.push(0);
        FaynUtils.Connect("spwanFruit",this.spwanFruit,this);
        this.spwanFruit();
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

    showEffectSprite(pos){
        let newEffect = new cc.Node();
        newEffect.scale=0;
        cc.find("Canvas").addChild(newEffect);
        newEffect.position=pos;
        newEffect.addComponent(cc.Sprite);
        newEffect.getComponent(cc.Sprite).spriteFrame = this.effectSprite;
        cc.tween(newEffect)
            .to(0.2,{scale:1})
            .call(()=>{
                cc.tween(newEffect)
                    .to(0.8,{opacity:0})
                    .call(()=>{
                        newEffect.destroy();
                    })
                    .start()
            })
            .start()
    }

    spwanFruit() {
        let newFruit = new cc.Node();
        newFruit.scale=0;
        cc.find("Canvas").addChild(newFruit);
        newFruit.position=this.fruitSpwanPos.position;
        newFruit.addComponent(cc.Sprite);
        newFruit.addComponent(Fruits);
        var index = this.makeProbabilityValues(GameManager.gailvList);
        newFruit.getComponent(cc.Sprite).spriteFrame = this.fruitsListSprite[index];
        newFruit.name=this.fruitsListSprite[index].name;
        console.log(newFruit.name);
        cc.tween(newFruit)
            .to(0.2,{scale:1})
            .call(()=>{
                newFruit.getComponent(Fruits).canCtrl=true;
            })
            .start()
    }
    spwanFruitByNum(oldNum:string,spwanPos:cc.Vec3) {
        let newFruit = new cc.Node();
        newFruit.scale = 0;
        cc.find("Canvas").addChild(newFruit);

        newFruit.position = spwanPos;
        newFruit.addComponent(cc.Sprite);
        newFruit.addComponent(Fruits);
        let num = this.getNumByName(oldNum);
        if (num < 10) {
            newFruit.getComponent(cc.Sprite).spriteFrame = this.fruitsListSprite[num + 1];
            newFruit.getComponent(Fruits).canCtrl = false;
            //newFruit.getComponent(Fruits).canCol = true;
            //====
            newFruit.addComponent(cc.RigidBody);
            newFruit.addComponent(cc.PhysicsCircleCollider);
            //newFruit.addComponent(cc.CircleCollider);
            newFruit.getComponent(cc.RigidBody).gravityScale = 5;
            newFruit.getComponent(cc.RigidBody).enabledContactListener = true;
            newFruit.getComponent(cc.PhysicsCircleCollider).restitution = 0.1;
            newFruit.getComponent(cc.PhysicsCircleCollider).tag = 1;
            newFruit.getComponent(cc.PhysicsCircleCollider).radius = newFruit.getContentSize().width / 2;
            //newFruit.getComponent(cc.CircleCollider).radius=newFruit.getContentSize().width / 2;
            newFruit.getComponent(cc.PhysicsCircleCollider).apply();
            //====

            newFruit.name = this.fruitsListSprite[num + 1].name;
            cc.tween(newFruit)
                .to(0.2, { scale: 1 })
                .start()
            return newFruit;
        }
    }

    getNumByName(name:string){
        switch (name) {
            case "2":
                return 0;
            case "4":
                return 1;
            case "8":
                return 2;
            case "16":
                return 3;
            case "32":
                return 4;
            case "64":
                return 5;
            case "128":
                return 6;
            case "256":
                return 7;
            case "512":
                return 8;
            case "1024":
                return 9;
            case "2048":
                return 10;
        }
    }

    myrandom(lower:number, upper:number) {
     return Math.floor(Math.random() * (upper - lower)) + lower;
    }

    update(){
        cc.find("Canvas/score").getComponent(cc.Label).string=GameManager.score.toString();
    }
}
