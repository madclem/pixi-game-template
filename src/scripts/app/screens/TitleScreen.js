import * as PIXI from 'PIXI';
import Device          from 'framework/system/Device';

export default class TitleScreen extends PIXI.Container {
	constructor(app) {
		super();

		// this.transition = new MyTransition(); // you can override the transition from the screen itself (see in ScreenManager)

		this.app = app;

        this.text = new PIXI.Text('TITLE SCREEN');
        this.text.anchor.set(.5);
        this.addChild(this.text);
	
        this.playButton = new PIXI.Graphics().beginFill(0xff0000).drawRect(-50,-50,100,100);
        this.playButton.interactive = true;
        this.playButton.buttonMode = true;
		this.addChild(this.playButton);
		this.playButton.click = this.playButton.tap = this.onButtonPressed.bind(this);
	}

	onButtonPressed()
	{
		
        if(Device.instance.android)
        {
            if(this.tick - this.tickDown >= 2 && !window.androidNormalVersion)
            {
                window.androidNormalVersion = true;
                window.renderer.plugins.accessibility.deactivate();
            }
            if (document.body.mozRequestFullScreen) {
                            // This is how to go into fullscren mode in Firefox
                            // Note the "moz" prefix, which is short for Mozilla.
                document.body.mozRequestFullScreen();
            } else if (document.body.webkitRequestFullScreen) {
                            // This is how to go into fullscreen mode in Chrome and Safari
                            // Both of those browsers are based on the Webkit project, hence the same prefix.
                document.body.webkitRequestFullScreen();
            }
        }

	
		this.screenManager.gotoScreenByID('game');
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
        // this.app.topMenu.setState('home'); // display the right buttons, youll have to do it yourself :p
    }

    onShown()
	{
	}
    
    onHide()
    {
        // this.app.overlayManager.onShow.remove(this.onOverlayShow, this);
        // this.app.overlayManager.onHide.remove(this.onOverlayHide, this);
    }

	onOverlayShow()
	{
	}

	onOverlayHide()
	{
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
        this.text.position.y = h/2 - 80;
		this.playButton.position.set(w/2, h/2);
	}
}
