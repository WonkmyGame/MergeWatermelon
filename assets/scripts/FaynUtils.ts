export class FaynUtils {
    
    //#region plableSDK
    static SendEvent(event: 'startPlayPlayable' | 'finishPlayPlayable' | 'loadMainScene') {
        try {
            window.playableSDK.sendEvent(event);
            console.log(event);
        } catch (error) {
            if (error.message.indexOf("undefined") != -1) console.log("SDK未接入" + " 发送失败 " + event);
            else console.log(error.message);
        }
    }
static Signal(signalName)
    {
        cc.director.emit(signalName);
    }
    static Connect(signalName,func,target)
    {
        cc.director.on(signalName,func,target);
    }
    static SendEnterEvent(
        event: 'enterSection',
        params: {
            section: string;
            section_remark?: string;
        }
    ) {
        try {
            window.playableSDK.sendEvent(event, { section: params.section, section_remark: params.section_remark });
            console.log(event + "_" + params.section + "_" + params.section_remark);
        } catch (error) {
            if (error.message.indexOf("undefined") != -1) console.log("SDK未接入" + " 发送失败 " + params.section_remark);
            else console.log(error.message);
        }
    }
    static SendClickEvent(
        event: 'clickDownloadBar' | 'clickResurrection' | 'clickContent' | 'clickFinishDownloadBar' | 'clickFinishContent',
        params: {
            section: string;
            area: string;
            area_remark?: string;
        }
    ) {
        try {
            window.playableSDK.sendEvent(event, { section: params.section, area: params.area, area_remark: params.area_remark });
            console.log(event + "_" + params.section + "_" + params.area + "_" + params.area_remark);
        } catch (error) {
            if (error.message.indexOf("undefined") != -1) console.log("SDK未接入" + " 发送失败 " + params.area_remark);
            else console.log(error.message);
        }
    }

    static PlayableDownload() {

        try {
            window.playableSDK.openAppStore();
            console.log("playableSDK download");
        } catch (error) {
            console.log("playableSDK download error")
        }
    }
    //#endregion

    //#region cocos PlayMusic
    static PlayMusic(name, loop = false, volume = 1) {
        AudioEngine.Play(name, loop, volume);
    }
    static PauseMusic(name) {
        AudioEngine.Pause(name);
    }
    static ResumeMusic(name) {
        AudioEngine.Resume(name);
    }
    //#endregion
}


const { ccclass, property } = cc._decorator;

@ccclass

class AudioEngine extends cc.Component {


    // LIFE-CYCLE CALLBACKS:


    private static audios: Audio[] = [];
    private static path: string = "";

    private static Preload(path) {
        AudioEngine.audios = new Array<Audio>();
        cc.resources.preloadDir(path, cc.AudioClip);

        this.path = path;
    }

    public static Play(name, loop = false, volume = 1) {
        if(AudioEngine.audios == undefined) {
            AudioEngine.audios = new Array<Audio>();
            cc.resources.preloadDir('audios', cc.AudioClip);
        }

        let audioID;
        let a: Audio;
        cc.resources.load((this.path != "" ? this.path + "/" + name : "audios/" + name), cc.AudioClip, (err, audio: cc.AudioClip) => {
            audioID = cc.audioEngine.play(audio, loop, volume);
            a = new Audio(audioID, audio);
            AudioEngine.audios.push(a);
            cc.audioEngine.setFinishCallback(audioID, function () {
                AudioEngine.removeFinishedAudio(audioID);
            })
        })

        return audioID;
    }

    public static Resume(name) {
        let aId = this.GetIdByName(name);
        if (aId != -1) {
            cc.audioEngine.resume(aId);
            return aId;
        }
        return -1;
    }

    public static Pause(name) {
        let audioId = AudioEngine.GetIdByName(name);

        if (audioId != null) {
            return cc.audioEngine.pause(audioId);
        }

        return null;
    }

    public static GetState(name) {

        let audioId = AudioEngine.GetIdByName(name)

        if (audioId != null) return cc.audioEngine.getState(audioId)

        return null;
    }

    private static removeFinishedAudio(audioID) {
        //删除非循环播放
        for (let taudio of AudioEngine.audios) {
            if (taudio.id === audioID && cc.audioEngine.isLoop(audioID) == false) {
                let index = AudioEngine.audios.indexOf(taudio);
                if (index > -1) {
                    AudioEngine.audios.splice(index, 1);
                    return;
                }
            }
        }
    }



    private static GetIdByName(name) {
        for (let taudio of AudioEngine.audios) {
            if (taudio.name === name) {
                return taudio.id
            }
        }
        return -1;
    }
    // update (dt) {}
}

class Audio {
    public id: number;
    public clip: cc.AudioClip;
    public name: string;

    constructor(_id, _clip) {
        this.id = _id;
        this.clip = _clip;
        this.name = _clip.name;
    }

}
