
    import * as PIXI from 'pixi.js';
    import Ticker from 'framework/system/Ticker';
    import Signal from 'signals';

    /**
     * Generic loader screen
     * @param {Object} app
     */
    class LoaderScreen extends PIXI.Container
    {
        constructor(app){
            super();
            this.app = app;

            this.easeLoad = 0;
            this.targetLoad = 0;

            this.onReady = new Signal();
            this.onComplete = new Signal();

            this.initLoader();
        }

        initLoader() {
            Ticker.instance.add(this.update, this);

            this.resize(this.w, this.h);

            this.onReady.dispatch();
        }
      
        update() {
            this.easeLoad += (this.targetLoad - this.easeLoad) * 0.3;

            if(this.easeLoad > 0.99) {
                this.easeLoad = 1;
                Ticker.instance.remove(this.update, this);
                this.onComplete.dispatch();
            }
        }

        updateProgress(percent) {
            this.targetLoad = percent;
        }

        onHide() {
          // make sure to remove tick on hide!
            Ticker.instance.remove(this.update, this);
        }


        resize(w, h) {
            this.w = w;
            this.h = h;
        }
    }




    export default LoaderScreen;
