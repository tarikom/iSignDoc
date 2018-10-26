var MongoClient = require('mongodb').MongoClient;

var uri = "mongodb+srv://tarikom:tarikom1@clustersign-nwnpv.gcp.mongodb.net/iSignDoc?retryWrites=true";
function openConnections() {
    return new Promise((resolve, reject) => {
        let promiseChain = Promise.resolve();
    
        promiseChain = promiseChain.then(() => {
            return MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
                    const collection = client.db("iSignDoc").collection("Users");
                    console.log('connect!!');
                    client.close();
                });                  
        });        
    
        promiseChain
          .then(resolve)
          .catch(reject);
      });
}

module.exports.openConnections = openConnections;