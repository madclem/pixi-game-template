import * as PIXI from 'pixi.js';
import ScreenManager from '../../framework/app/ScreenManager';
import Signal from 'signals';

export default class OverlayManager extends ScreenManager {
    constructor(){
        super();

        this.onShow = new Signal();
        this.onHide = new Signal();

        this.view = new PIXI.Container();

        // do the overlays here, works a bit like a ScreenManager so you should be fine :)
        // basically showOverlay(), hideOverlay(), etc.!
    }

    resize() {}
}