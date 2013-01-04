(function(){

  if (typeof console === "undefined") { console = {}; }
  if (typeof console.log === "undefined") { console.log = function(){}; }

  window.setupQrReader = function(options){

    if( window.actQR ){
      console.log("Only one QR reader per page is supported.");
      return;
    }

    // sample of function that may be registered as Callback.
    window.actQR = function( msg ){
      // msg comes null if no code were detected
      if( msg === null ){ //expect a lot of nulls
        //console.log("no QR were read at this time")
      } else {
        // a valid QR reading, do something with it
        options.success(msg);
        // ask flash to stop parsing, this saves processing as webcam reading stop
        QR.stop()
      }
    };

    // sampe of function to be called when something goes wrong
    window.noWebcam = function( msg ){
      options.noWebcam();
    };

    // this setInterval is a safe measure, so we don't call flash function before it is loaded;
    var registerQRCb = setInterval(function(){
      //var nomeDoFlash = "QR"
      if( QR.start ){
        clearInterval(registerQRCb)
        // first param is the function signature we want the SWF to call periodicaly
        // second param is the intervall we want it, in miliseconds (default: half-second)
        // third is an signature for callback if something goes wrong, aka, user has no Webcam (default: null)
        QR.start( "actQR", 200, "noWebcam" )
      }
    }, 100);



    // add the swf to the page
    var flashvars = {};
    var params = {
      menu: "false",
      scale: "noScale",
      allowFullscreen: "true",
      allowScriptAccess: "always",
      bgcolor: "",
    };
    var attributes = {
      id: 'QR'
    };
    swfobject.embedSWF(
      options.qr_swf, 
      options.container_id, options.width, options.height, "10.0.0", 
      options.express_install_swf, 
      flashvars, params, attributes);

  };

})();