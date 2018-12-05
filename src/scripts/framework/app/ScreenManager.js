
    import * as PIXI from 'pixi.js';
    import ColorTransition from './transitions/ColorTransition';
    import NoTransition from './transitions/NoTransition';


    /**
     * ScreenManager for main views
     * @param {PIXI.Container} container
     * @param {Number} width
     * @param {Number} height
     */
    class ScreenManager
    {
        constructor(container, width, height, transition){
            this.container = container || new PIXI.Container();

            this.screens = {};
            this.currentScreen;
            this.fading = false;

            this.w = width || 400;
            this.h = height || 400;

            this.history = [];

            this.defaultTransition = transition || new ColorTransition();
            this.noTransition = new NoTransition();

            this.transition = this.defaultTransition;
            this.active = false;

            this.transitionMap = {};
        }

        /**
         * register a specific transition from one screen to another
         * @param  {Transition} transition the transition instance to use
         * @param  {String} from the starting screen id
         * @param  {String} to the starting screen id
         * @param  {boolean} use the same transition when going in reverse too
         */
        registerTransition(transition, from, to, both)
        {
            this.transitionMap[from + to] = transition;

            if(both)
            {
                this.transitionMap[to + from] = transition;
            }
        }

        /**
        * Jump to a screen with the provided ID
        * @param  {String} id
        * @param  {Boolean} instant
        * @return {null}
        */
        gotoScreenByID(id, params, instant, forceRefresh)
        {
            var screen = this.screens[id];


            if( !screen )
            {
                throw new Error( 'screen not found with id : '+id);
            }
            else
            {

                this.gotoScreen( screen, params, instant, forceRefresh);
            }
        }

        getScreenByID(id)
        {
            var screen = this.screens[id];

            if( !screen )
            {
                throw new Error( 'screen not found with id : '+id);
            }
            else
            {
                return screen;
            }
        }

      /**
      * Add a screen to the manager cache
      * @param  {Object} id
      * @param  {String} instant
      * @return {null}
      */
        addScreen(screen, id)
        {
            this.screens[id] = screen;
            screen.id = id;
            screen.firstRun = true;
            screen.screenManager = this;

            return screen;
        }

        goBack()
        {
            this.history.pop();
            var prev = this.history.pop();

            if(prev)
            {
                this.gotoScreen(prev);
            }
        }


        getScreenId( screen )
      {
            for( var key in this.screens )
        {
                if( this.screens[ key] === screen )
          {
                    return key;
                }
            }

            return null;
        }

        gotoScreen(screen, params, instant, forceRefresh)
      {

            if( !forceRefresh && this.currentScreen === screen) return;

            if (screen.firstRun) {
                if (screen.init) screen.init();
                screen.firstRun = false;
            }
            this.history.push(screen);
            this.nextScreen = screen;

            // due to the raised condition
            if(this.active) {
                screen._tmpParams = {
                    params,
                    instant,
                    forceRefresh,
                };
            }
            if(this.active) return;

            this.active = true;



            var current = this.currentScreen;

            if(this.nextScreen)if(this.nextScreen.resize)this.nextScreen.resize(this.w, this.h);

            this.currentScreen = screen;
            if (this.currentScreen.beforeShow) {
                this.currentScreen.beforeShow(params);
            }


            this.transition = this.noTransition

            if(!instant)
            {
                var key =  (current?current.id:'') + this.nextScreen.id;
                this.transition = screen.transition || this.transitionMap[key] || this.defaultTransition;
            }

            if(this.transition.onResize) this.transition.onResize(this.w, this.h);
            this.transition.begin(this, current, this.nextScreen);
        }

        onTransitionComplete()
      {
            this.active = false;
            if(this.currentScreen != this.nextScreen)
        {
                const tmp =  this.nextScreen._tmpParams;
                this.gotoScreen(this.nextScreen, tmp.params, tmp.instant, tmp.forceRefresh);
                delete this.nextScreen._tmpParams;
            }
        }

        resize(w, h)
      {
            this.w = w;
            this.h = h;

            if(this.transition.onResize)this.transition.onResize(w, h);
            if(this.currentScreen)if(this.currentScreen.resize)this.currentScreen.resize(w, h);
        }
    }



    export default ScreenManager;
