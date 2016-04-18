/*!
 * Copyright © 2016 Eneko Sanz <contact@eneko.me>
 * File distributed under the MIT license.
 * 
 * Description:
 * Entry point of the server application.
 */

var express = require('express');

// Express app and global middleware.
var app = express(),
    morgan = require('morgan'),
    compression = require('compression');

// Set server port.
app.set('port', process.env.PORT || 3000);

// Use gzip compression.
app.use(compression());

// Logging middleware in the development environment.
// Environment mode (app.get('env') or app.settings.env) defaults to
// process.env.NODE_ENV environmental var ('development' if not set).
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

// Serve static files.
app.use(express.static('static'));

// Serve static index.html file.
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Endpoint used by the client to retrieve carousel blocks as JSON.
app.get('/blocks', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send([{ 
    title: 'Bilbao',
    images: ['/img/1.jpg',
             '/img/2.jpg',
             '/img/3.jpg',
             '/img/4.jpg']
  }, {
    title: 'Barcelona',
    images: ['/img/5.jpg',
             '/img/6.jpg',
             '/img/7.jpg',
             '/img/8.jpg']
  }, {
    title: 'Donostia',
    images: ['/img/9.jpg',
             '/img/10.jpg',
             '/img/11.jpg']
  }]);
});

// Reply with a 404 if nothing previously matches.
app.use(function(req, res) {
  res.status(404).send('Not found!');
})

// Start the HTTP server.
app.listen(app.get('port'), function() {
  console.log('HTTP server listening on port ' + app.get('port'));
});
