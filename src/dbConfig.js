const mySql = require('mysql2/promise');

const dbConfig = {
    host: 'us-cdbr-east-03.cleardb.com',
    port: 3306,
    user: 'bf61ed7e8ed4b9',
    password: 'f78568f9a2f3db5',
    database: 'heroku_b769b65366a82fe',
    connectionLimit: 10,
};

const db = mySql.createPool(dbConfig);

module.exports = db