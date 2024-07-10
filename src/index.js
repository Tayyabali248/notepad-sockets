require('dotenv').config();

/**
 * Module dependencies.
 */

const app = require('./app');
const http = require('http');

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const server = http.createServer(app);

const io = new SocketServer(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
});

dbConnection();

module.exports = { io };

require("./sockets");

app.get("/", (req, res) => {
  res.send(`App is running on ${port}`);
});

app.use((req, res) => {
  res
    .status(404)
    .json({ status: 404, success: false, message: "Route not found" });
});

app.use((err, res) => {
  console.error("error stack", err.stack);
  res.status(500).json({ error: err.stack });
});

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('App started. Listening on ' + bind);
}
