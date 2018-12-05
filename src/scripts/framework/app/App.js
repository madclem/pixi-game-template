
import * as PIXI from 'pixi.js';
import Loader     from 'framework/loader/Loader';
import ScreenManager    from 'framework/app/ScreenManager';
import Ticker     from 'framework/system/Ticker';
import LoaderScreen     from 'framework/app/LoaderScreen';
import Signal from 'signals';


class App {
    constructor(options){
        options = options || App.defaultOptions;

         this.options = {};
        for (var i in App.defaultOptions) this.options[i] = options[i] || App.defaultOptions[i];

        this.setupPixi();

        // start the ticker and start rendering!
        Ticker.instance.start();
        Ticker.instance.add(this.update, this);

        this.preloader     = new Loader();
        this.loader        = new Loader();
        
        // signals
        this.onReady       = new Signal();
        
        this.screenManager = new ScreenManager(null, 300, 300);
        this.stage.addChild(this.screenManager.container);
    }

    setupPixi() {
        var options = this.options;

        const Renderer = PIXI.WebGLRenderer || PIXI.Renderer;

        if(options.forceCanvas)
        {
            this.renderer = new PIXI.CanvasRenderer(options.width, options.height);
            this.renderer.clearBeforeRender = true;
        }
        else
        {
            var opts = {resolution:1, backgroundColor : options.backgroundColor, transparent: !!options.transparent};
            this.renderer = new Renderer(opts, options.width, options.height);
            this.renderer.clearBeforeRender = false;
        }

        window.WEBGL = PIXI.isWebGL = ( this.renderer instanceof Renderer );
        window.renderer = this.renderer; // THIS IS A BIT HACKEY..

        this.view = this.renderer.view;
        this.stage = new PIXI.Container();
        this.view.style.position = 'absolute';
        this.view.addEventListener('mousedown',   function(){
            window.focus();
        }, true);

        PIXI.stage = this.stage;
    }

    update() {        
        this.renderer.render(this.stage);
    }

    startup() {
        this.preloader.onComplete.addOnce(this.onPreloadComplete, this);
        this.preloader.load();
    }

    onPreloadComplete( )
    {        
        this.loaderScreen = new this.options.loaderScreen(this);
        this.loaderScreen.onReady.addOnce(this.onLoaderScreenReady, this);
        this.loaderScreen.onComplete.addOnce(this.onLoaderScreenComplete, this);

        this.screenManager.addScreen(this.loaderScreen, 'loader');
        this.screenManager.gotoScreenByID('loader');
    }

    onLoaderScreenReady( )
    {
        console.log('loadersreenready');
        
        // loader screen is ready! time to start loading assets..
        this.loader.onComplete.addOnce(this.onAssetsLoaded, this);
        this.loader.onProgress.add(this.onProgresss, this);
        this.loader.load();
    }


    onAssetsLoaded( )
    {
    }

    onProgresss(percent) {
        this.loaderScreen.updateProgress(percent);
    }

    onLoaderScreenComplete() {
        this.onReady.dispatch();
    }


    resize(w, h)
    {
        this.renderer.resize(w, h);
        this.view.style.width = 'auto';
        this.view.style.height = 'auto';
    }

}

App.defaultOptions =
{
    width           : 800,
    height          : 600,
    forceCanvas     : false,
    transparent     : false,
    backgroundColor : 0x000000,
    loaderScreen    : LoaderScreen,
    config    : null
};

export default App;
