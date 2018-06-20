const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

// logging: standard Apache combined log output
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));

// all routes served from save static html
const staticMiddleware = express.static('build');
['/', '/home', '/about', '/contact', '/fun-stuff'].forEach(function (route) {
  app.use(route, staticMiddleware);
});

// unrecognizes routes get redirected to the top route
app.get('*', function (req, res) {
  res.redirect('/');
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
