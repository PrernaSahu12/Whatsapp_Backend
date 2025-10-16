const http = require('http');
const app = require('./src/app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
