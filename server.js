'use strict';

let http = require('http');
let path = require('path');
let fs = require('fs');

let mimeTypes = {
    '.js' : 'text/javascript',
    '.map' : 'text/javascript',
    '.html' : 'text/html',
    '.css' : 'text/css',
    '.png' : 'image/png',
    '.jpg' : 'image/jpeg',
    '.mp3' : 'audio/mpeg3',
    '.ttf' : 'font/ttf',
    '.ico' : 'image/x-icon'
};
const port = 3000;

function handleRequest(request, response) {
    console.log('request : ', request.url);
    let lookup = (request.url === '/') ? '/index.html' : decodeURI(request.url);
    let file = lookup.substring(1, lookup.length);

    fs.access(file, fs.constants.R_OK, function(err) {
        if (!err) {
            fs.readFile(file, function(error, data) {
                if (error) {
                    response.writeHead(500);
                    response.end('Server Error!');
                } else {
                    let headers = {'Content-type': mimeTypes[path.extname(lookup)]};
                    response.writeHead(200, headers);
                    response.end(data);
                }
            });
        } else {
            console.log(`${lookup} doesn't exist`);
            response.writeHead(404);
            response.end();
        }
    });
}

http.createServer(handleRequest).listen(port, function() {
    console.log(`Server is listening on port ${port}`);
});
