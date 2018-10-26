const webServer = require('./services/web-server.js');
const database  = require('./services/database.js');

// Increasing threadpool size to allow more connection in the database
// connection pool to work at the same time.
process.env.UV_THREADPOOL_SIZE = 20;

console.log('Starting application');
console.log('Opening connections to databases');

database.openDbConnections(); 

process.on('uncaughtException', err => {
  console.log('Uncaught exception', err);

  shutdown(err);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM');

  shutdown();
});

process.on('SIGINT', () => {
  console.log('Received SIGINT');

  shutdown();
});

function shutdown(e) {
  let err = e;
    
  console.log('Shutting down');
  console.log('Closing web server');

  webServer.stop()
    .catch(e => {
      console.log('Encountered error', e);

      err = err || e;
    })
    .then(() => {
      console.log('Closing connections to databases');

      return database.closeConnections();
    })
    .catch(e => {
      console.log('Encountered error', e);

      err = err || e;
    })
    .then(() => {
      console.log('Exiting process');

      if (err) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    });
};