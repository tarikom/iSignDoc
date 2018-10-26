const users = require('../db_apis/users.js');
const security = require('../services/security.js');

function post(req, res, next) {  
  const context = {
    email: req.body.email
  };
  let user;

  users.find(context)  
    .then(users => {
      if (users.length !== 1) {
        throw new Error('Error finding user');
      }

      user = users[0];

      return security.validatePassword(req.body.password, user.password);
    })
    .then(pwMatch => {
      if (!pwMatch) {
        res.status(401).json({message: 'Invalid email or password.'});
        return;
      }

      return security.getSessionToken(user)
        .then(token => {
          user.token = token;
          
          delete user.role;
          delete user.password;

          res.status(201).json(user);
        })
    })
    .catch(next);
}

module.exports.post = post;
