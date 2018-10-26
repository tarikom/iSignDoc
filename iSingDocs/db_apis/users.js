const oracledb = require('oracledb');
const database = require('../services/database.js');
const security = require('../services/security.js');
const connectionName = 'hr';

const findQuery = 
 `select id "id",
    email "email",
    password "password",
    role "role"
  from users`;

const findOneQuery = findQuery + '\n' +
  `where id = :id`;

function find(context) {
  return new Promise((resolve, reject) => {
    let query;
    let binds = {};

    if (context.id) {
      query = findOneQuery;
      binds.id = context.id;
    } else if (context.email) {
      query = findQuery + '\n' + 'where email = :email';
      binds.email = context.email.toLowerCase();
    } else {
      query = findQuery;
    }

    database.simpleExecute(connectionName, query, binds)
      .then(result => resolve(result.rows))
      .catch(reject);
  });
}

module.exports.find = find;

const createSql =
 `insert into users (
    email,
    password,
    role
  ) values (
    :email,
    :password,
    :role
  ) returning id 
  into :id`;

function create(user) {
  return new Promise((resolve, reject) => {
    user.role = 'BASE';
    user.email = user.email.toLowerCase();
    user.id = {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER
    };

    security.hashPassword(user.password)
      .then(hashedPassword => {
        user.password = hashedPassword;

        return database.simpleExecute(connectionName, createSql, user);
      })
      .then(result => {
        user.id = result.outBinds.id[0];

        resolve(user)
      })
      .catch(reject);
  });
}

module.exports.create = create;
