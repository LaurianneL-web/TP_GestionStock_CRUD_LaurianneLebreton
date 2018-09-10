/*jshint esversion :  6 */

// @root/model/marque.js

const marqueModel = function marqueModel(connection) {

    const create = function createmarque(clbk, data) {
      const q = "INSERT INTO marque (nom) VALUES (?)";
      const payload = [data.nom];
  
      connection.query(q, payload, (err, res, cols) => {
        // console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
        if (err) return clbk(err, null);
        return clbk(null, res);
      });
    };
  
    const remove = function deletemarque(clbk, ids) {
      // la clause SQL IN permet de chercher une valeur dans un tableau
      const q = "DELETE FROM marque WHERE id_marque IN (?)";
      
      connection.query(q, [ids], function (err, res, fields) {
        // console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
        if (err) return clbk(res, null);
        return clbk(null, res);
      });
    };
  
    const update = function editmarque(clbk, marque) {
      const q = "UPDATE marque SET nom = ? WHERE id_marque = ?";
      const payload = [marque.nom, marque.id_marque];
      connection.query(q, payload, function (err, res, fields) {
        // console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
        if (err) return clbk(err, null);
        return clbk(null, res);
      });
    };
  
    const get = function getmarque(clbk, id) {
      var sql;
      
      if (id && !isNaN(id)) {
        sql = "SELECT * FROM marque WHERE id = ?";
      } else {
        sql = "SELECT * FROM marque";
      }
  
      connection.query(sql, [id], (error, results, fields) => {
        // console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
        if (error) return clbk(error, null);
        return clbk(null, results);
      });
    };
  
    return {
      create,
      remove,
      update,
      get
    };
  };
  
  module.exports = marqueModel;
  