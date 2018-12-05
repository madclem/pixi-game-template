import * as PIXI from 'PIXI';
import Device          from 'framework/system/Device';

export default class GameScreen extends PIXI.Container {
	constructor(app) {
		super();

		// this.transition = new MyTransition(); // you can override the transition from the screen itself (see in ScreenManager)

        this.app = app;

        this.text = new PIXI.Text('GAME');
        this.text.anchor.set(.5);
        this.addChild(this.text);
	}

	init() {
		console.log('init screen titleScreen');
	}

	beforeShow(params) {
		console.log('beforeShow titleScreen');
	}

	onShow()
	{
        this.tick = 0;
		this.app.overlayManager.onShow.add(this.onOverlayShow, this);
		this.app.overlayManager.onHide.add(this.onOverlayHide, this);
    }

	onOverlayShow() {
	}

	onOverlayHide() {
	}

	updateTransform() // override PIXI.COntainer updateTransform (called every frame when on screen)
	{
		super.updateTransform();
	}

	resize(w, h)
	{
		this.w = w;
        this.h = h;	
        
        this.text.position.x = w/2;
        this.text.position.y = h/2;
	}
}
