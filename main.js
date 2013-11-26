var system = require('system');
var page = require('webpage').create();

var url = system.args[1];

page.settings.viewportSize = { width: 1600, height: 8000 };

page.open(url, function (status) {

    // failed
    if (status !== 'success') {
        console.log('Unable to load!');
        phantom.exit();
    } else {

        //var rect = page.evaluate(function(){
        //   return document.querySelector('img').getBoundingClientRect();
        //});

        //page.clipRect = { top: rect.top, left: rect.left, width: rect.right - rect.left, height: rect.bottom - rect.top };

        page.onConsoleMessage = function(msg) {console.log('From page: ', msg);};
        if(page.injectJs('detect.js')){

            var result = page.evaluate(function(){
                return detect(document.querySelector('img'));
            });

            console.log('------------------------—');
            console.log('上边框 ', result.top);
            console.log('右边框 ', result.right);
            console.log('下边框 ', result.bottom);
            console.log('左边框 ', result.left);
            console.log('-------------------------');

            phantom.exit();
        }

    }
});

