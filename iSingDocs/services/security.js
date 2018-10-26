const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/security.js');

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(config.saltRounds)
      .then(salt => {
        return bcrypt.hash(password, salt);
      })
      .then(resolve)
      .catch(reject);
  });
}

module.exports.hashPassword = hashPassword;

module.exports.validatePassword = bcrypt.compare; 

function getSessionToken(user) {
  return new Promise((resolve, reject) => {
    const payload = {
      sub: user.email,
      role: user.role
    };

    jwt.sign(payload, config.secret, {expiresIn: config.sessionExpiresIn}, function(err, token) {
      if (err) {
        reject(err);
        return;
      }

      resolve(token);
    });
  });
}

module.exports.getSessionToken = getSessionToken;

function authenticate(role) {
  return function(req, res, next) {
    if (!req.headers.authorization) {
      res.status(401).json({message: 'You are not authorized'});
      return;
    }

    const token = req.headers.authorization;

    jwt.verify(token, config.secret, function(err, payload) {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          res.status(401).json({message: 'Token Expired'});
        } else {
          res.status(401).json({message: 'Authentication failed'});
        }

        return;
      }

      if (!role || role === payload.role) {
        //pass some user details through in case they are needed
        req.user = {
          email: payload.sub,
          role: payload.role
        };

        next();
      } else {
        res.status(401).send({message: 'You are not authorized'});
      }
    });
  }
}

module.exports.authenticate = authenticate;

function assertSimpleSqlName(name) {
  if (name.length > 30) {
    throw new Error('Not simple SQL');
  }

  // Fairly generic, but effective. Would need to be adjusted to accommodate quoted identifiers,
  // schemas, etc.
  if (!/^[a-zA-Z0-9#_$]+$/.test(name)) {
    throw new Error('Not simple SQL');
  }

  return name;
}

module.exports.assertSimpleSqlName = assertSimpleSqlName;

function assertValidSortOrder(order) {
  if (order !== 'desc' && order !== 'asc') {
    throw new Error('Not valid sort order');
  }

  return order;
}

module.exports.assertValidSortOrder = assertValidSortOrder;
