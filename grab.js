var system = require('system');
var page = require('webpage').create();

//var url = system.args[1];
var url = 'http://www.wanggou.com';

page.settings.viewportSize = { width: 1600, height: 10000 };

page.open(url, function (status) {

    // failed
    if (status !== 'success') {
        console.log('Unable to load!');
        phantom.exit();
    } else {
//        console.log(page.content);

        var content = page.content;
        var regSrc = /(init_)?src=['"][^'"]*?['"]/ig;

        var srcArray = content.match(regSrc);

        console.log(srcArray.length);

        phantom.exit();







    }
});

page.onConsoleMessage = function(msg, lineNum, sourceId) {
//    console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};

page.onError = function(msg, trace) {

    var msgStack = ['ERROR: ' + msg];

    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
        });
    }

    // 不打印错误信息
//    console.error(msgStack.join('\n'));

};


