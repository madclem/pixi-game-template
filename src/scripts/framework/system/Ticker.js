

import Signal from 'signals';

class Ticker
{
    constructor(){
        this.onUpdate = new Signal();

        this.updateBind = this.update.bind(this);

        this.active = false;

    //

        this.deltaTime = 1;
        this.timeElapsed = 0;
        this.lastTime = 0;

        this.speed = 1;

    }

    start()
  {
        if(this.active)return;

        this.active = true;
        requestAnimationFrame(this.updateBind);
    }


    stop()
  {
        if(!this.active)return;
        this.active = false;
    }

    update()
  {
        if(this.active)
      {
            requestAnimationFrame(this.updateBind);

            var currentTime =  new Date().getTime();
            var timeElapsed = currentTime - this.lastTime;

          // cap the time!
            if(timeElapsed > 100)timeElapsed = 100;
            this.deltaTime = (timeElapsed * 0.06);

            this.deltaTime *= this.speed;// * 3;

         // console.log(this.deltaTime)
          // 60 ---> 1
          // 30 ---> 2

            this.onUpdate.dispatch(this.deltaTime);

            this.lastTime = currentTime;
        }

    }

    add(listener, scope)
  {
        this.onUpdate.add(listener, scope);
    }

    remove(listener, scope)
  {
        this.onUpdate.remove(listener, scope);
    }

}


Ticker.instance = new Ticker();
Ticker.game = new Ticker();

export default Ticker;
