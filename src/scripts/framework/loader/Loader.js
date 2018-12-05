    import * as PIXI from 'pixi.js';
    import Signal from 'signals';
    import path from 'path';
    import FontFaceObserver from 'fontfaceobserver';

    class Loader
    {
        constructor(){
            this.crossdomain = false;

            if(window.XDomainRequest && this.crossdomain)
            {
                this.ajaxRequest = new window.XDomainRequest();
            // XDomainRequest has a few querks. Occasionally it will abort requests
            // A way to avoid this is to make sure ALL callbacks are set even if not used
            // More info here: http://stackoverflow.com/questions/15786966/xdomainrequest-aborts-post-on-ie-9
                this.ajaxRequest.timeout = 3000;

                this.ajaxRequest.onerror = function(){};

                this.ajaxRequest.ontimeout = function(){};

                this.ajaxRequest.onprogress = function(){};

            }
            else if (window.XMLHttpRequest)
            {
                this.ajaxRequest = new window.XMLHttpRequest();
            }

            this.ajaxRequest.onload = this._onFileLoaded.bind(this);
            this.ajaxRequest.onreadystatechange = function(){};

            this.fileCount = 0;
            this.indexFontToLoad = 0;
            this.filesToLoad = [];

            this.fontsToLoad = [];
            this.pixiAssetsToLoad = [];
            this.soundsToLoad = [];
            this.customToLoad = [];

            this.onComplete = new Signal();
            this.onProgress = new Signal();

        }

        _loadFont(font) {
            var ffo = new FontFaceObserver(font);

            ffo.load().then(function () {
                this._loadFonts();
            }.bind(this));

        }

        _loadFonts() {
            if(this.fontsToLoad.length === 0) {
                this._loadFiles();
                return;
            }

            this._loadFont(this.fontsToLoad[0]);
            this.fontsToLoad.shift();
        }

        addFonts(fonts)
      {
            this.fontsToLoad = this.fontsToLoad.concat(fonts);
            return this;
        }

        addText(url, id)
      {
            id = id || path.basename(url, path.extname(url));

            var fileData = {url:url, id:id, type:Loader.TEXT};

            this.filesToLoad.push(fileData);
            return this;
        }

        addJson(url, id)
      {
            id = id || path.basename(url, path.extname(url));

            var fileData = {url:url, id:id, type:Loader.JSON};

            this.filesToLoad.push(fileData);
            return this;
        }

        addAndFilterManifest(manifest, base, prefix)
      {
            prefix = prefix || '@0.5x';

            this.addManifest(manifest.filter(function(item){

                return !item.includes(prefix);

            }), base);

            return this;
        }

        addManifest(manifest, base)
        {


            var assetManifest = manifest
          .map(function(path){
              return base + path;
          });

            this.addPixiAssets(assetManifest);
            return this;
        }
        addAudioManifest(manifest , base)
        {
          var assetManifest = manifest
          .map(function(path){
              return {
                source: base + path,
                name: path.replace(base, '').slice(0, -4)
              };
          });

          this.addPixiAssets(assetManifest);
          return this;
        }

        addPixiAssets(assets)
        {
            this.pixiAssetsToLoad = this.pixiAssetsToLoad.concat(assets);
            return this;
        }

        addCSS(url)
      {
            var link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = url;
            document.getElementsByTagName('head')[0].appendChild(link);

          // var tester = document.createElement("div");
          // tester.setAttribute('id', 'test-chunkFiveRoman');
          // tester.innerHTML = 'TEST';
          // document.body.appendChild(tester);
            return this;
        }

        addCustom(customObject)
        {
            var fileData = {object:customObject, type:Loader.CUSTOM};

            this.filesToLoad.push(fileData);

            return this;
        }

        load()
      {
            this._loadFonts();
        }


      /*

          PRIVATE...

       */
        _loadFiles()
      {
            this.fileCount = 0;

            if(this.filesToLoad.length)
          {
                this._loadNextFile();
            }
            else
          {
                this._loadPixiAssets();
            }
        }

        _loadNextFile()
      {
            var fileData = this.filesToLoad[this.fileCount];

            if(fileData.type === Loader.CUSTOM)
          {
                fileData.object.onLoaded.addOnce(this._onFileLoaded, this);
                fileData.object.load();
            }
            else
          {
                this.ajaxRequest.open('GET',fileData.url,true);
                this.ajaxRequest.send();
            }
        }

        _onFileLoaded()
      {
            var fileData = this.filesToLoad[this.fileCount];

            if(fileData.type === Loader.CUSTOM)
          {
              // done!
            }
            else
          {

                if(this.ajaxRequest.status === 0 || this.ajaxRequest.status === 200)
              {
                    switch(fileData.type)
                  {
                    case Loader.TEXT:

                        var text = this.ajaxRequest.responseText;
                        // Cache.addText( text, fileData.id );

                        break;

                    case Loader.JSON:
                        var jsonObject = JSON.parse( this.ajaxRequest.responseText );
                        // Cache.addJson( jsonObject, fileData.id );
                        break;
                    }
                }
                else
              {                    
                }
            }

            this.fileCount++;
            this._onProgress();

            if(this.fileCount === this.filesToLoad.length)
          {
              // complete!
                this._loadPixiAssets();
            }
            else
          {
                this._loadNextFile();
            }

        }

        _loadPixiAssets()
      {
            if(this.pixiAssetsToLoad.length === 0)
          {
                this._onComplete();
                return;
            }

            const Loader = PIXI.loaders ? PIXI.loaders.Loader : PIXI.Loader;

            this.pixiAssetLoader = new Loader();

            this.pixiMiddleWares.forEach( middleware =>
              this.pixiAssetLoader.use( middleware() )
            );


            //this.pixiAssetLoader = PIXI.loader;
            for (var i = 0; i < this.pixiAssetsToLoad.length; i++) {
              if(this.pixiAssetsToLoad[i].name) {
                this.pixiAssetLoader.add(this.pixiAssetsToLoad[i].name, this.pixiAssetsToLoad[i].source);
              } else {
                this.pixiAssetLoader.add(this.pixiAssetsToLoad[i]);
              }

            }
   //       this.pixiAssetLoader.onComplete = this._onComplete.bind(this);
     //     this.pixiAssetLoader.onProgress = this._onProgress.bind(this);
     //
            this.pixiAssetLoader.on('progress', this._onProgress, this);

            this.pixiAssetLoader.load( this._onComplete.bind(this) );
        }

      // _loadFonts()
      // {
      //     if(this.fontsToLoad.length === 0)
      //     {
      //         this._loadFiles();
      //         return;
      //     }
      //
      //     WebFont.load({
      //
      //         custom: {
      //             families: this.fontsToLoad,
      //             urls: [ASSET_URL + './css/fonts.css']
      //         },
      //
      //         active: function()
      //         {
      //             for (var i = 0; i < this.fontsToLoad.length; i++)
      //             {
      //                 ////console.log(this.fontsToLoad[i])
      //                 var cheekyBox = new PIXI.Text("cheeky", {font : '32px '+this.fontsToLoad[i]});
      //                 cheekyBox.updateText();
      //             };
      //
      //         }.bind(this)
      //       });
      //
      //     this._loadFiles();
      //
      //     // Google font config
      //     /*
      //     WebFontConfig =
      //     {
      //         google :
      //         {
      //             families : this.fontsToLoad
      //         },
      //         active: function()
      //         {
      //             this._loadFiles();
      //         }.bind(this)
      //     };
      //
      //     (function()
      //     {
      //         var wf = document.createElement('script');
      //         wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      //             '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
      //         wf.type = 'text/javascript';
      //         wf.async = 'true';
      //         var s = document.getElementsByTagName('script')[0];
      //         s.parentNode.insertBefore(wf, s);
      //     })();
      //     */
      // }

        _onComplete(l, r)
      {
          //HACK
            PIXI.loadedResources = r;
            this.onProgress.dispatch(1);
            this.onComplete.dispatch();
        }

        _onProgress()
      {
            var loaded = this.fileCount;

            if(this.pixiAssetLoader)
          {
              // the new pixi loader gives us a progress
              // property which is a percentage (between 0 and 100)
                loaded = this.pixiAssetLoader.progress;
            }
          // we want a value betwen 0 and 1
            this.onProgress.dispatch(loaded * 0.01);
        }




    }


    // some constants..
    Loader.TEXT = 0;
    Loader.JSON = 1;
    Loader.CUSTOM = 2;

    export default Loader;
