// importing genereal modules

//load environment
require('dotenv').config();

// module for handling http requests and responses and managing routes
const express = require('express');
// module for parsing (json-)requests
const bodyParser = require('body-parser');
// helper for concatinating paths
const path = require('path');

// importing self-developed moudules
const routes = require('./routes/main');

const api = express();

// initialize body-parser for JSON-format
api.use(bodyParser.json());

// Setting response header to allow cross origin requests
// CORS-Settings.
api.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// set static path for public dirctory
api.use(express.static(path.join(__dirname, 'public')));



api.use(routes);
// fallback: redirect to / in case there is no routing match
api.use((req, res, next) => {
  res.redirect('/');
});

// error handler sends error message as json
api.use((err, req, res, next) => {
  res.status(err.statusCode).json(
    {
      errorMessage: err.message
    }
  )
})

api.listen(3000);