class NoTransition
{
    constructor(){

    }

    begin(screenManager, currentScreen, nextScreen) {
        if( currentScreen )
    {
            if(currentScreen.onHide)currentScreen.onHide();
            if(currentScreen.onHidden)currentScreen.onHidden();
            screenManager.container.removeChild(currentScreen);
        }

        screenManager.container.addChildAt(nextScreen, 0);
        if(nextScreen.onShow)nextScreen.onShow();
        if(nextScreen.onShown)nextScreen.onShown();

        screenManager.onTransitionComplete();
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
    }
}

export default NoTransition;
