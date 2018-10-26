const oracledb = require('oracledb');
const connections = require('../config/dbconfig.js');
const connectionKeys = Object.keys(connections);

function openConnections() {
  return new Promise((resolve, reject) => {
    let promiseChain = Promise.resolve();

    connectionKeys.forEach(key => {
      promiseChain = promiseChain.then(() => {
        return oracledb.createPool({
          user: connections[key].user,
          password: connections[key].password,
          connectString: connections[key].connectString,
          poolAlias: key,
          poolMin: connections[key].poolMin,
          poolMax: connections[key].poolMax,
          poolIncrement: connections[key].poolIncrement,
          _enableStats: connections[key]._enableStats
        });
      });
    });

    promiseChain
      .then(resolve)
      .catch(reject);
  });
}

module.exports.openConnections = openConnections;

function closeConnections() {
  return new Promise((resolve, reject) => {
    let promiseChain = Promise.resolve();

    connectionKeys.forEach(key => {
      promiseChain = promiseChain.then(() => {
        return oracledb.getPool(key).close();
      });
    });

    promiseChain
      .then(resolve)
      .catch(reject);
  });
}

module.exports.closeConnections = closeConnections;

// simpleExecute will get a connection, execute a statment, and then close the
// connection in a single call.
function simpleExecute(connection, statement, binds = [], opts = {}) {
  return new Promise((resolve, reject) => {
    let conn;
    let err;

    opts.outFormat = oracledb.OBJECT;
    opts.autoCommit = true;

    oracledb.getPool(connection).getConnection()
      .then(c => {
        conn = c;

        return conn.execute(statement, binds, opts);
      })
      .then(r => {
        result = r;
      })
      .catch(e => {
        err = err || e;
      })
      .then(() => {
        if (conn) { // conn assignment worked, need to close
          return conn.close();
        }
      })
      .catch(err => {
        err = err || e;
      })
      .then(() => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
  });
}

module.exports.simpleExecute = simpleExecute;
