const express = require('express')
const path = require('path');
const expressStaticGzip = require('express-static-gzip');
const port = process.env.PORT || 8282
const app = express()

function start() {
  //GZIP and Brotli compression
  app.use('/', expressStaticGzip(path.join(__dirname + '/dist'), {
    enableBrotli: true,
    orderPreference: ['br', 'gz'],
  }));

  app.get('/serverHealthCheck', function (request, response) {
    response.sendStatus(200);
  });

  /* Redirect http to https */
  app.get('*', function (req, res, next) {
    if (!req.hostname.includes('localhost') && req.headers['x-forwarded-proto'] != 'https' && process.env.NODE_ENV === 'production')
      res.redirect('https://' + req.hostname + req.url)
    else
      next() /* Continue to other routes if we're not redirecting */
  });
  // serve static assets normally
  app.use(express.static(__dirname + '/dist'));

  // handle every other route with index.html, which will contain
  // a script tag to your application's JavaScript file(s).

  app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
  });

  app.listen(port)

  // eslint-disable-next-line no-console
  console.log("server started on port " + port)
}

start();
