const users = require('../db_apis/users.js');
const security = require('../services/security.js');

function post(req, res, next) {  
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  users.create(user)
    .then(user => {
      delete user.password;

      return security.getSessionToken(user);
    })
    .then(token => {
      delete user.role;

      user.token = token;

      res.status(201).json(user);
    })
    .catch(next);
}

module.exports.post = post;
