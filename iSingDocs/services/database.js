const databaseOra = require('../services/databaseOra.js');
const databaseMongo = require('../services/databaseMongo.js');
const webServer = require('../services/web-server.js');
const http = require('../config/http.js');

function openDbConnections() {
    if (http.database === 'mongo') {
        return  databaseMongo.openConnections()
        .then(()=>{
        console.log('Starting web server');
        
        return webServer.start();            
        })
        .catch(err => {
        console.log('Encountered error', err);
    
        process.exit(1);
        });;
    } else if (http.database === 'ora') {
        return databaseOra.openConnections()
        .then(() => {
        console.log('Starting web server');
    
        return webServer.start();
        })
        .catch(err => {
        console.log('Encountered error', err);
    
        process.exit(1);
        });
    };   
} 

module.exports.openDbConnections = openDbConnections;

function closeConnections() {
    if (http.database === 'mongo') {
        console.log('Already closed');
    }  else if (http.database === 'ora') {
        databaseOra.closeConnections();
    }      
}

module.exports.closeConnections = closeConnections;