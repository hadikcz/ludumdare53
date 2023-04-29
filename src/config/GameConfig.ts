import phaserBasicSettings from 'config/json/phaserBasicSettings.json';
import ui from 'config/json/ui.json';

export default {
    PhaserBasicSettings: phaserBasicSettings,
    UI: ui,
    World: {
        size: { // 	640	360 is ART -> double it
            // 1024 x 640
            // width: 1360,
            // height: 768,
            width: 1024 * 10,
            height: 640
        }
    }
};
