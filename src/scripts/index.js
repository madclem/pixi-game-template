import 'gsap';
import * as PIXI from 'pixi.js';
import Device from 'framework/system/Device';
import App from 'app/Application';

window.PIXI = PIXI;
window.ASSET_URL = 'assets/';

window.initGame = function() {



	const containerId = 'game-holder';
		

    const app = new App();
    const container = document.getElementById(containerId);
    container.appendChild(app.view);

    container.style.background = 'black';

    app.view.style.position = 'absolute';
    app.view.style.top = 0;
    app.view.style.left = 0;

    function resize() {
        window.scrollTo(0, 0);
        let w = window.innerWidth;
        let h = window.innerHeight;
        if(Device.instance.android)
        {
            w = window.document.documentElement.clientWidth || window.innerWidth;
            h = window.document.documentElement.clientHeight || window.innerHeight;
        }
        app.resize(w, h);
    }

    window.addEventListener('resize', function() {
        resize();
    });

	resize();
}

initGame();