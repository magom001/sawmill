// server/app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { postgraphile } = require('postgraphile');

const app = express();

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Plug in the postgraphile
app.use(
  postgraphile(process.env.DATABASE_URL || 'postgres://magom001:581321@localhost:5432/sawmill', 'factory', {graphiql:true})
);

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;
