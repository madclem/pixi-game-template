import * as PIXI from 'pixi.js';
  

class ColorTransition
{
    constructor(){
        this.colorRect = new PIXI.Graphics().beginFill(0x000000).drawRect(0, 0, 2000, 1000);
        this.colorRect.alpha = 0;
    }

    begin(screenManager, currentScreen, nextScreen)
    {
        this.screenManager = screenManager;

        this.currentScreen = currentScreen;
        this.nextScreen = nextScreen;

        this.screenManager.container.addChild(this.colorRect);

        if(this.currentScreen)
      {
            if(this.currentScreen.onHide) this.currentScreen.onHide();

            TweenLite.to(this.colorRect, 0.4, {alpha:1, onComplete:this.onFadeout.bind(this)});

        }
        else
      {
            this.onFadeout();
        }
    }

    onFadeout()
    {
        if(this.currentScreen)
      {
            if(this.currentScreen.onHidden)this.currentScreen.onHidden();
            this.screenManager.container.removeChild(this.currentScreen);
            this.currentScreen.alpha = 1;
        }


        if(this.nextScreen.onShow)this.nextScreen.onShow();
        if(this.nextScreen.resize)this.nextScreen.resize(this.screenManager.w, this.screenManager.h);


        this.screenManager.container.addChild(this.nextScreen);
        this.screenManager.container.addChild(this.colorRect);

        TweenLite.to(this.colorRect, 0.4, {alpha:0, onComplete:this.onFadein.bind(this)});
    }

    onFadein()
    {
        this.screenManager.container.removeChild(this.colorRect);
        if(this.nextScreen.onShown)this.nextScreen.onShown();
        this.screenManager.onTransitionComplete();
    }

    resize(w, h)
    {
        if(this.w === w && this.h === h)return;

        this.w = w;
        this.h = h;

        this.colorRect.scale.x = w/100;
        this.colorRect.scale.y = h/100;
    }
}


export default ColorTransition;
