

class Device
{
    constructor(){
        this.arora = false;
        this.chrome = false;
        this.epiphany = false;
        this.firefox = false;
        this.mobileSafari = false;
    /**
    * @property {boolean} ie - Set to true if running in Internet Explorer.
    * @default
    */
        this.ie = false;

    /**
    * @property {number} ieVersion - If running in Internet Explorer this will contain the major version number. Beyond IE10 you should use Device.trident and Device.tridentVersion.
    * @default
    */
        this.ieVersion = 0;

    /**
    * @property {boolean} trident - Set to true if running a Trident version of Internet Explorer (IE11+)
    * @default
    */
        this.trident = false;

    /**
    * @property {number} tridentVersion - If running in Internet Explorer 11 this will contain the major version number. See http://msdn.microsoft.com/en-us/library/ie/ms537503(v=vs.85).aspx
    * @default
    */
        this.tridentVersion = 0;
        this.midori = false;
        this.opera = false;
        this.safari = false;
        this.silk = false;
        this.webApp = false;
        this.cocoonJS = false;
        this.android = false;
        this.chromeOS = false;
        this.iOS = false;
        this.linux = false;
        this.macOS = false;
        this.windows = false;
        this.desktop = false;
        this.pixelRatio = 0;
        this.iPhone = false;
        this.iPhone4 = false;
        this.iPhoneX = false;
        this.iPad = false;
        this.blob = false;
        this.canvas = false;
        this.localStorage = false;
        this.file = false;
        this.fileSystem = false;
        this.webGL = false;
        this.worker = false;
        this.audioData = false;
        this.webAudio = false;
        this.ogg = false;
        this.opus = false;
        this.mp3 = false;
        this.wav = false;
        this.m4a = false;
        this.webm = false;

        var ua = navigator.userAgent;

        this._checkBrowser(ua);
        this._checkOS(ua);
        this._checkDevice(ua);
        this._checkAudio();
        this._checkFeatures();
        this._checkIsMobile();
        this._checkIsTouch();
    }

    _checkBrowser(ua)
  {
        if (/Arora/.test(ua))
      {
            this.arora = true;
        }
        else if (/Opera|OPR|op/.test(ua))
      {
            this.opera = true;
            this.chrome = false;
        }
        else if (/Chrome/.test(ua))
      {
            this.chrome = true;
        }
        else if (/Epiphany/.test(ua))
      {
            this.epiphany = true;
        }
        else if (/Firefox/.test(ua))
      {
            this.firefox = true;
        }
        else if (/Mobile Safari/.test(ua))
      {
            this.mobileSafari = true;
        }
        else if (/MSIE (\d+\.\d+);/.test(ua) || !!navigator.userAgent.match(/Trident.*rv[ :]*11\./))
      {
            this.ie = true;
            this.ieVersion = parseInt(RegExp.$1, 10);
        }
        else if (/Midori/.test(ua))
      {
            this.midori = true;
        }
        else if (/Safari/.test(ua))
      {
            this.safari = true;
        }
        else if(/\bSilk\b/.test(ua))
      {
            this.silk = true;
        }
        else if (/Trident\/(\d+\.\d+)(.*)rv:(\d+\.\d+)/.test(ua))
      {
            this.ie = true;
            this.trident = true;
            this.tridentVersion = parseInt(RegExp.$1, 10);
            this.ieVersion = parseInt(RegExp.$3, 10);
        }

      // Native Application
        if (navigator['standalone'])
      {
            this.webApp = true;
        }

      // CocoonJS Application
        if (navigator['isCocoonJS'])
      {
            this.cocoonJS = true;
        }
    }

    _checkOS(ua)
  {
        if (/Android/.test(ua))
      {
            this.android = true;
        }
        else if (/CrOS/.test(ua))
      {
            this.chromeOS = true;
        }
        else if (/iP[ao]d|iPhone/i.test(ua))
      {
            this.iOS = true;

                    // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);

            this.iOS_version = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];

        }
        else if (/Linux/.test(ua))
      {
            this.linux = true;
        }
        else if (/Mac OS/.test(ua))
      {
            this.macOS = true;
        }
        else if (/Windows/.test(ua))
      {
            this.windows = true;
        }

        if (this.windows || this.macOS || this.linux || this.chromeOS)
      {
            this.desktop = true;
        }
    }

    _checkDevice()
    {
        this.pixelRatio = window['devicePixelRatio'] || 1;

        
        this.iPhone = navigator.userAgent.toLowerCase().indexOf('iphone') !== -1;
        this.iPhone4 = (this.pixelRatio === 2 && this.iPhone);
        
        if(this.iPhone4)
        {
            this.iPhone4 = (window.screen.height == (960 / 2) && window.screen.width == (320) ) ||
            (window.screen.width == (960 / 2) && window.screen.height == (320) );
        }
        
        
        this.iPad = navigator.userAgent.toLowerCase().indexOf('ipad') !== -1;
        
        // Define the users device screen dimensions
        const screen = {
            width : window.screen.width * this.pixelRatio,
            height : window.screen.height * this.pixelRatio
        };
        
        // iPhone X Detection
        this.iPhoneX = (this.iPhone && ( ( screen.width == 1125 && screen.height === 2436 ) || ( screen.width == 828 && screen.height === 1792 ) ) );// iphone xr
        
        this.isKindle = this._isKindle();
    }    

    _checkFeatures()
  {
        if (typeof window['Blob'] !== 'undefined') this.blob = true;

        this.canvas = !!window['CanvasRenderingContext2D'];

        try
      {
            this.localStorage = !!localStorage.getItem;
        }
        catch (error)
      {
            this.localStorage = false;
        }

        this.file = !!window['File'] && !!window['FileReader'] && !!window['FileList'] && !!window['Blob'];
        this.fileSystem = !!window['requestFileSystem'];
        this.webGL = ( function () { try {
            var canvas = document.createElement( 'canvas' );
            return !! window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) );
        } catch( e ) {
            return false;
        }
        } )();


        if(this.android ||  this.ie)this.webGL = false;

        this.worker = !!window['Worker'];

        if ('ontouchstart' in document.documentElement || window.navigator.msPointerEnabled)
      {
            this.touch = true;
        }
    }

    _checkAudio()
  {
        this.audioData = !!(window['Audio']);
        this.webaudio = !!(window['AudioContext'] || window['webkitAudioContext']);

        var audioElement = document.createElement('audio');
        var result = false;
        try
        {
            if (result == !!audioElement.canPlayType)
          {
                if (audioElement.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''))
              {
                    this.ogg = true;
                }

                if (audioElement.canPlayType('audio/mpeg;').replace(/^no$/, ''))
              {
                    this.mp3 = true;
                }

              // Mimetypes accepted:
              //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
              //   bit.ly/iphoneoscodecs
                if (audioElement.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ''))
              {
                    this.wav = true;
                }

                if (audioElement.canPlayType('audio/x-m4a;') || audioElement.canPlayType('audio/aac;').replace(/^no$/, ''))
              {
                    this.m4a = true;
                }
            }
        }
        catch (e) {
            // console.log(e);
        }
    }

    _checkIsMobile()
  {
        var check = false;

        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true;})(navigator.userAgent||navigator.vendor||window.opera);

        this.isMobile = check;
        this.mobile = check;
    }

    _checkIsTouch()
  {
        this.isTouch = (('ontouchstart' in window)
        || (navigator.MaxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0));
    }

    is_touch_device() {

    }

    getInfo()
  {
        var output = 'DEVICE OUTPUT\n\n';

        output += '---\n';
        output += 'Browser Info :: \n';
        output += 'Arora : ' + this.arora + '\n';
        output += 'Chrome : ' + this.chrome + '\n';
        output += 'Epiphany : ' + this.epiphany + '\n';
        output += 'Firefox : ' + this.firefox + '\n';
        output += 'Mobile Safari : ' + this.mobileSafari + '\n';
        output += 'IE : ' + this.ie;

        if(this.ie)
      {
            output += ' (Version ' + this.ieVersion + ')\n';
        }
        else
      {
            output += '\n';
        }

        output += 'Midori : ' + this.midori + '\n';
        output += 'Opera : ' + this.opera + '\n';
        output += 'Safari : ' + this.safari + '\n';
        output += 'Web App : ' + this.webApp + '\n';
        output += 'CocoonJS : ' + this.cocoonJS + '\n';
        output += 'Android : ' + this.android + '\n';
        output += '---\n';
        output += 'Operating System :: \n';
        output += 'Chrome OS : ' + this.chromeOS + '\n';
        output += 'iOS : ' + this.iOS + '\n';
        output += 'Linux : ' + this.linux + '\n';
        output += 'Mac OS : ' + this.macOS + '\n';
        output += 'Windows : ' + this.windows + '\n';
        output += 'Desktop : ' + this.desktop + '\n';
        output += '---\n';
        output += 'Device Type : \n';
        output += 'Pixel Ratio : ' + this.pixelRatio + '\n';
        output += 'iPhone : ' + this.iPhone + '\n';
        output += 'iPhone 4 : ' + this.iPhone4 + '\n';
        output += 'iPad : ' + this.iPad + '\n';
        output += '---\n';
        output += 'Features :: \n';
        output += 'Blob : ' + this.blob + '\n';
        output += 'Canvas : ' + this.canvas + '\n';
        output += 'LocalStorage : ' + this.localStorage + '\n';
        output += 'File : ' + this.file + '\n';
        output += 'File System : ' + this.fileSystem + '\n';
        output += 'WebGL : ' + this.webGL + '\n';
        output += 'Workers : ' + this.worker + '\n';
        output += '---\n';
        output += 'Audio :: \n';
        output += 'AudioData : ' + this.audioData + '\n';
        output += 'WebAudio : ' + this.webAudio + '\n';
        output += 'Supports .ogg : ' + this.ogg + '\n';
        output += 'Supports Opus : ' + this.opus + '\n';
        output += 'Supports .mp3 : ' + this.mp3 + '\n';
        output += 'Supports .wav : ' + this.wav + '\n';
        output += 'Supports .m4a : ' + this.m4a + '\n';
        output += 'Supports .webm : ' + this.webm;

        return output;
    }

    get ie9(){
        return (this.ie && this.ieVersion === 9);
    }

    get useSM2(){
        return (this.ie || this.opera);
    }

    get hasNotch() { return this.iPhoneX; }

    get notch()
    {
        const notch = { left: 0, right: 0 };
        if( this.hasNotch )
        {
            switch( window.orientation )
            {
                case 90:
                notch.left = 45;
                notch.right = 0;
                break;

                case -90:
                notch.left = 0;
                notch.right = -45;
                break;
            }
        }
        console.log('notch : ' + notch);
        return notch;
    }

    _isKindle()
    {
        const ua = navigator.userAgent;
        // list of kindle model ids, will need updating as new models are released:
        // https://developer.amazon.com/docs/fire-tablets/ft-specs-custom.html
        const kindleStrings = [
            "KFAUWI",
            "KFKAWI",
            "KFSUWI",
            "KFDOWI",
            "KFGIWI",
            "KFFOWI",
            "KFMEWI",
            "KFTBWI",
            "KFSAWA",
            "KFSAWI",
            "KFASWI",
            "KFARWI",
            "KFAPWA",
            "KFAPWI",
            "KFTHWA",
            "KFTHWI",
            "KFSOWI",
            "KFJWA",
            "KFJWI",
            "KFTT",
            "KFOT",
            "Kindle",
            "Silk"
        ];

        return kindleStrings.some( ( kindleString ) => {
            const matchRegExp = new RegExp (kindleString);
            return matchRegExp.test (ua)
        });
    }



}


// Object.defineProperty(Device.prototype,'ie9',{
//     get : function () {
//
//         return (this.ie && this.ieVersion === 9);
//     }
// });
//
// Object.defineProperty(Device.prototype,'useSM2',{
//     get : function () {
//
//         return (this.ie || this.opera);
//     }
// });

Device.instance = new Device();
// console.log(Device.instance);

export default Device;
