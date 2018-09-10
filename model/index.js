/*jshint esversion :  6 */

const database = function database(config) {
  const mysql  = require('mysql');

  const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : config.password,
    database : config.database
  });
  
  const connect = function connect() {
    connection.connect(function(err, res) {
      if (err) return console.error(err);
      else console.log("db connected");
       // le serveur node est connecté au serveur mysql (BDD)
    });
  };

  const end = function end() {
    connection.end(); // on termine la connection à la BDD
  };

  connect();

  return {
    connection
  };
};

module.exports = database;
