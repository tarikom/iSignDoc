module.exports = {
    user          : 'lobaso', 
    // process.env.NODE_ORACLEDB_USER || "hr",  
    // Instead of hard coding the password, consider prompting for it,
    // passing it in an environment variable via process.env, or using
    // External Authentication.
    password      :  '!lobaso1234',
    //process.env.NODE_ORACLEDB_PASSWORD || "welcome",
  
    // For information on connection strings see:
    // https://oracle.github.io/node-oracledb/doc/api.html#connectionstrings
    connectString : 'ABSGB_TEST.IOPDAY'
    //process.env.NODE_ORACLEDB_CONNECTIONSTRING || "localhost/orclpdb",
  
    // Setting externalAuth is optional.  It defaults to false.  See:
    // https://oracle.github.io/node-oracledb/doc/api.html#extauth
    //externalAuth  : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
  };