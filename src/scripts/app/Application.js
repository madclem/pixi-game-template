
import App from 'framework/app/App';
import Device from 'framework/system/Device';
import LoaderScreen from 'app/screens/LoaderScreen';
import TitleScreen from 'app/screens/TitleScreen';
import GameScreen from 'app/screens/GameScreen';
import TopMenu from 'app/TopMenu';
import OverlayManager from 'app/overlay/OverlayManager';

export default class Application extends App {
    constructor() {
        var options = {
			loaderScreen: LoaderScreen,
			backgroundColor:0x000000,
			transparent: true
		};

        super(options);
        
        this.safeSize =
        {
            width : 1136,
            height : 640
        };

        this.maxSize =
        {
            width : 1390,
            height : 700
        };
            
        this.preloader
			.addPixiAssets([
            ]);
            
		this.loader
			.addPixiAssets([
            ])
            
        this.onReady.add(this.onAppReady, this);
        this.startup();
    }

    onAppReady() {
		// startup the app.. when it is ready to go onReady will be fired..
		this.overlayManager = new OverlayManager(this);

		this.titleScreen = new TitleScreen(this);
		this.gameScreen = new GameScreen(this);

		this.screenManager.addScreen(this.titleScreen, 'title');
		this.screenManager.addScreen(this.gameScreen, 'game');
		

		this.stage.addChild(this.overlayManager.view);

		this.topMenu = new TopMenu(this);
		this.stage.addChild(this.topMenu);

		this.screenManager.gotoScreenByID('title', {data:'coucou'});
		
        this.resize(this.w, this.h);    
    }
    
    update()
	{
		super.update();

		if(this.hasFocus && Save.instance)
        {
            var currentTime = new Date();
            var timeElapsed = currentTime - this.lastTime;

            var difference = (timeElapsed) / 1000;

            this.timer += difference;

            if(this.timer >= 15)
            {
                Stats.track("timer", "heartbeat",{
					heartbeat_period : 15,
					game_level_name: getLevelName(Save.instance.object.currentLevel),
					game_screen: this.screenManager.currentScreen.id
				});
                //console.log('15 SECONDS');
                this.timer -= 15;
            }

            this.lastTime = currentTime;

        }
    }
    
	resize(w, h) {
		this.w = w;
		this.h = h;

		var scale = 1;
    
		if(Device.instance.isMobile)
		{
			if(window.devicePixelRatio) {
				scale = window.devicePixelRatio;
			} else {
				scale = window.screen.deviceXDPI / window.screen.logicalXDPI;
			}
		}
		if(scale > 1.5)scale = 1.5;

		var ratio = w/(this.safeSize.width) < h/(this.safeSize.height) ? w/(this.safeSize.width) : h/(this.safeSize.height);
		var w2 = Math.min(this.maxSize.width * ratio, w);
		var h2 = Math.min(this.maxSize.height * ratio, h);

		this.renderer.resize((w2 * scale) | 0, (h2 * scale) | 0);

		this.view.style.width = w2 + 'px';
		this.view.style.height = h2 + 'px';

		this.view.style.left = w/2 - (w2)/2 + 'px';
		this.view.style.top = h/2 - (h2)/2 + 'px';

		this.screenManager.resize(w2/ratio, h2/ratio);

		if(this.overlayManager) {
			this.overlayManager.resize(w2/ratio, h2/ratio);
			this.overlayManager.view.scale.set(ratio * scale);
		}

		if(this.topMenu) {
			this.topMenu.scale.set(ratio * scale);
			this.topMenu.resize(w2/ratio, h2/ratio);
		}

		this.screenManager.container.scale.set(ratio * scale);
	}
}