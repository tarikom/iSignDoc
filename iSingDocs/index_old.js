var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var oracledb = require('oracledb');
//var pool = require('./db/pool');
//var jwt = require('jsonwebtoken'); 
var dbConfig = require('./config/dbconfig.js'); 
var httpconfig = require('./config/http.js'); 

function init() {
    oracledb.createPool({
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString      
    })
      .then(function(pool) {
        app.use( function(req, res, next) {
            handleRequest(req, res, pool, next);
        });
        app.listen(httpconfig.httpPort);
        // Create HTTP server and listen on port - httpPort          
        console.log("Server running at http://localhost:" + httpconfig.httpPort);
      })
      .catch(function(err) {
        console.error("createPool() error: " + err.message);
      });
  };

function  handleRequest(req, res, pool, next) {
    console.log("Done!!");
};

init();  