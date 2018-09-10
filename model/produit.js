/*jshint esversion :  6 */

// @root/model/produit.js

const produitModel = function produitModel(connection) {

  const create = function createproduit(clbk, data) {
    const q = "INSERT INTO produit (nom, id_marque, prix, description) VALUES (?, ?, ?, ?)";
    const payload = [data.nom, data.id_marque, data.prix, data.description];

    connection.query(q, payload, (err, res, cols) => {
      // console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
      if (err) return clbk(err, null);
      return clbk(null, res);
    });
  };

  const remove = function deleteproduit(clbk, ids) {
    // la clause SQL IN permet de chercher une valeur dans un tableau
    const q = "DELETE FROM produit WHERE id IN (?)";

    connection.query(q, [ids], function (err, res, fields) {
      // console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
      if (err) return clbk(res, null);
      return clbk(null, res);
    });
  };

  const update = function editproduit(clbk, produit) {
    const q = "UPDATE produit SET nom = ?, id_marque = ?, prix = ?, description = ? WHERE id = ?";
    const payload = [produit.nom, produit.id_marque, produit.prix, produit.description, produit.id];
    connection.query(q, payload, function (err, res, fields) {
      // console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
      if (err) return clbk(err, null);
      return clbk(null, res);
    });
  };

  const get = function getproduit(clbk, id) {
    var sql;
    
    if (id && !isNaN(id)) {
      sql = "SELECT p.*, m.* FROM produit p INNER JOIN (SELECT id_marque AS id_brand, nom AS brand FROM marque) m ON p.id_marque=m.id_brand WHERE id = ?";
    } else {
      sql = "SELECT p.*, m.* FROM produit p INNER JOIN (SELECT id_marque AS id_brand, nom AS brand FROM marque) m ON p.id_marque=m.id_brand";
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

module.exports = produitModel;
