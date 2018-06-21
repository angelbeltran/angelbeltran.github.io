const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

// logging: standard Apache combined log output
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));

// all routes served from save static html
const staticMiddleware = express.static('build');
 app.use('/', staticMiddleware);
['/home', '/about', '/contact', '/fun-stuff'].forEach(function (route) { // recognized routes
  app.use(route, staticMiddleware);
  app.use(route + '/*', staticMiddleware);
});


const randomFactList = [
  "Great mathematician (I like to pretend).",
  "Loves software and making stuff.",
  "Has a great family.",
  "Remembers his wedding anniversary each year.",
  "Really good at video games (sometimes).",
  "Good at MarioKart.",
  "Plays guitar.",
  "Can draw an octopus really well.",
  "Doesn't take himself too seriously."
];
const randomFactsIndices = randomFactList.map((s, i) => i);
function randomFacts(n) {
  n = n || 1;
  let indices = randomFactsIndices.slice();
  const indexChoices = [];
  let m = n;

  while (m > 0) {
    const i = Math.floor(Math.random() * indices.length);
    const index = indices[i];
    indexChoices.push(index);

    indices = indices.slice(0, i).concat(indices.slice(i + 1));
    if (!indices.length) {
      indices = randomFactsIndices.slice();
    }
    m -= 1;
  }

  return indexChoices.map(i => randomFactList[i]);
}

app.get('/api/about/random-fact/', function (req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  let quantity;

  try {
    quantity = parseInt(req.query.quantity);
  } catch (e) {
    quantity = 1;
  } finally {
    if (isNaN(quantity) || !quantity) {
      quantity = 1;
    }
  }

  res.append('Content-Type', 'application/json');
  res.send(randomFacts(quantity));
});

// unrecognizes routes get redirected to home
app.get('*', function (req, res) {
  res.redirect('/home');
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
