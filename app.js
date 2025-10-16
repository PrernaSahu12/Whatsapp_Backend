#!/usr/bin/env node
const http = require('http');
// try to load the express app from src/app.js
let app;
try {
  app = require('./src/app');
} catch (err) {
  console.error('Unable to load ./src/app.js:', err.message);
  process.exit(1);
}

const port = process.env.PORT || 3000;
const server = http.createServer(app);

if (require.main === module) {
  server.listen(port, () => console.log(`Server listening on port ${port}`));
}

module.exports = app;
