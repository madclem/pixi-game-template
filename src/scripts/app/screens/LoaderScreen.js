// import PIXI from 'PIXI'

import * as PIXI from 'PIXI';
import Ticker          from  'framework/system/Ticker';
import Signal          from  'signals';


export default class LoaderScreen extends PIXI.Container {
	constructor(app) {
		super();

		this.app = app;
		this.count = 0;

		app.loader.onProgress.add(this.onProgress, this);

		this.easeLoad = 0;
		this.targetLoad = 0;

		this.onReady = new Signal();
        this.onComplete = new Signal();
        
        setTimeout(this.onAssetsLoaded.bind(this), 1);
    }
    
	onShown()
	{
	}

	onAssetsLoaded()
	{
		this.container = new PIXI.Container();

		this.bg = new PIXI.Sprite();
		this.addChild(this.bg);

		// this.barBg = new PIXI.Sprite.from('loader_empty.png');
		this.barBg = new PIXI.Sprite();
		this.barBg.anchor.set(.5);
		this.container.addChild(this.barBg);

		this.containerBar = new PIXI.Container();
		this.container.addChild(this.containerBar);

		// this.bar = new PIXI.Sprite.from('loader_full.png');
		this.bar = new PIXI.Sprite();
		this.bar.anchor.set(.5);

		
		this.containerBar.addChild(this.bar);
		

		let m = new PIXI.Graphics().beginFill(0xff0000).drawRect(0, 0, this.bar.width, this.bar.height);
		m.position.set(-this.bar.width/2, -this.bar.height/2)
		m.scale.x = 0;
		this.containerBar.addChild(m);
		this.containerBar.mask = m;

		Ticker.instance.add(this.update, this);

		this.addChild(this.container);

		this.resize(this.w, this.h);

		this.app.loader.load();
	}

	update()
	{
		this.count++;

        console.log('jere');
        
		this.easeLoad += (this.targetLoad - this.easeLoad);
		this.containerBar.mask.scale.x = this.easeLoad;

		if(this.easeLoad > 0.99)
		{

            Ticker.instance.remove(this.update,this);
			this.onComplete.dispatch();
			this.containerBar.mask.scale.x = 1;
		}
	}

	onProgress(percent)
	{
		this.targetLoad = percent;
	}

	onShow()
	{
	}

	onHide()
	{
		Ticker.instance.remove(this.update, this);
	}

	resize(w, h)
	{
		this.w = w;
		this.h = h;

        if(this.bg) {
            this.bg.width = w;
            this.bg.height = h;
        }

        if(this.container){
            this.container.position.x = w/2;
            this.container.position.y = h/2 + 50;
        }

	}
}
