var phantom = require('phantom');
var http = require('http');
var url = require('url');

http.createServer(function (req, res) {

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('fuck');

    var query = url.parse(req.url, true).query;
    var img_url = decodeURIComponent(query.url);

    if(img_url != 'undefined' && img_url != ''){

        console.log(img_url);

        // phantom node
        phantom.create(function(ph) {
            ph.createPage(function(page) {
                page.open(img_url, function(status){

                    if (status !== 'success') {

                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end('Error: Unable to load resource!');

                        ph.exit();

                    } else {

                        // inject detect.js
                        page.injectJs('detect.js', function(){

                            page.evaluate(function(){
                                return detect(document.querySelector('img'));
                            }, function(result){

                                res.writeHead(200, {'Content-Type': 'text/plain'});
                                res.end(JSON.stringify(result));

                                ph.exit();
                            });
                        });

                    }
                });
            });
        });
    }


}).listen(8080, '10.12.23.58');

console.log('Server running at http://127.0.0.1:8080');
