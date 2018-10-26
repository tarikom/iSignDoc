const express = require('express');
const router = express.Router();
const security = require('./security.js');
//const employees = require('../controllers/employees.js');
const users = require('../controllers/users.js');
const sessions = require('../controllers/sessions.js');

/*router.route('/employees/:id?')
  .get(security.authenticate(), employees.get)
  .post(security.authenticate('ADMIN'), employees.post)
  .put(security.authenticate('ADMIN'), employees.put)
  .delete(security.authenticate('ADMIN'), employees.delete);*/

router.route('/users')
  .post(users.post);

router.route('/sessions')
  .post(sessions.post);

module.exports = router;
