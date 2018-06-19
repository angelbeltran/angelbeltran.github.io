const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
app.use(express.static('build'));

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
