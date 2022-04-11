const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;
const server = http.createServer(app);     // takes the listner function or request handler as an argument

server.listen(port);

