// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { FaynUtils } from "./FaynUtils";
import GameManager from "./GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Fruits extends cc.Component {

    gameManager=null

    canCtrl=false;

    canTrigger=true;

    canCol=true;


    start () {
        this.gameManager=cc.find("Canvas").getComponent(GameManager);
        this.node.parent.on(cc.Node.EventType.TOUCH_START,this.startMoveFruits,this);
        this.node.parent.on(cc.Node.EventType.TOUCH_MOVE,this.moveFruits,this);
        this.node.parent.on(cc.Node.EventType.TOUCH_END,this.putDownFruits,this);
    }

    startMoveFruits(event){
        if(this.canCtrl==true){
            let canvasPos=event.getLocation();
            let wolrdPos=this.node.parent.convertToNodeSpaceAR(canvasPos);
            cc.tween(this.node)
                .to(0.2,{position:new cc.Vec3(wolrdPos.x,this.node.y,0)})
                .start()
        }
    }
    moveFruits(event){
        if(this.canCtrl==true){
            let canvasPos=event.getLocation();
            let wolrdPos=this.node.parent.convertToNodeSpaceAR(canvasPos);
            this.node.x=wolrdPos.x;
        }
    }
    
    putDownFruits (event) {
        if(this.canCtrl==true){
            let canvasPos=event.getLocation();
            let wolrdPos=this.node.parent.convertToNodeSpaceAR(canvasPos);
            this.node.x=wolrdPos.x;
            this.node.addComponent(cc.RigidBody);
            this.node.addComponent(cc.PhysicsCircleCollider);
            this.node.getComponent(cc.RigidBody).gravityScale=5;
            this.node.getComponent(cc.RigidBody).enabledContactListener=true;
            this.node.getComponent(cc.PhysicsCircleCollider).restitution=0.1;
            this.node.getComponent(cc.PhysicsCircleCollider).tag=1;
            this.node.getComponent(cc.PhysicsCircleCollider).radius=this.node.getContentSize().width/2;
            this.node.getComponent(cc.PhysicsCircleCollider).apply();
            cc.tween(this.node)
                .to(1,{scaleX:0.8})
                .start()
            this.scheduleOnce(function(){ 
                FaynUtils.Signal("spwanFruit");
            },0.7);
            this.canCtrl=false;
        }
    }
    
    onBeginContact(contact, self, other) {
        this.node.scaleX=1;
        if(other.node.name==="ground"){
            this.canCol=false;
            this.node.addComponent(cc.CircleCollider).radius=this.node.getContentSize().width / 2;
            this.node.getComponent(cc.CircleCollider).tag=1;
        }
        if (other.tag == 1 && other.node.name === self.node.name) {
            
            if (this.canCol == true) {
                self.node.destroy();
                other.node.destroy();
                this.gameManager.spwanFruitByNum(this.node.name, this.node.position);
                this.canCol = false;
                this.gameManager.showEffectSprite(this.node.position);
                GameManager.score++;
            }
        }
    }

    onCollisionEnter(other, self) {
        if (other.tag == 1 && other.node.name === self.node.name) {
            if(this.canCol == true)return;
            other.node.getComponent(Fruits).canTrigger=false;
            if (this.canTrigger == true) {
                self.node.destroy();
                other.node.destroy();
                this.gameManager.spwanFruitByNum(this.node.name, this.node.position);
                this.canTrigger = false;
                this.gameManager.showEffectSprite(this.node.position);
                GameManager.score++;
            }
        }
    }

    myrandom(lower:number, upper:number) {
     return Math.floor(Math.random() * (upper - lower)) + lower;
    }
}
