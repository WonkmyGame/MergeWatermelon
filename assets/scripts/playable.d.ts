function sendEvent(event: 'startPlayPlayable' | 'finishPlayPlayable' | 'loadMainScene'): void;
function sendEvent(
    event: 'enterSection',
    params: {
        section: string;
        section_remark?: string;
    }
): void;
function sendEvent(
    event: 'clickDownloadBar' | 'clickResurrection' | 'clickContent' | 'clickFinishDownloadBar' | 'clickFinishContent',
    params: {
        section: string;
        area: string;
        area_remark?: string;
    }
): void;

interface Window {
    playableSDK: {
        openAppStore: () => void;
        sendEvent: typeof sendEvent;
    };
}
