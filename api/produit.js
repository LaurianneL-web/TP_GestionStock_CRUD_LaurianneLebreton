/* jshint esversion : 6 */

const produitAPi = function produitAPi(connection) {

  const router = require("express").Router();
  const produitModel = require("./../model/produit")(connection);

  router.get('/produit/:id', (req, res) => {
    produitModel.get((err, dataset) => {
      if (err) return res.status(500).send(err);
      else return res.status(200).send(dataset[0]);
    }, req.params.id);
  });

  router.get('/produit', (req, res) => {
    produitModel.get( (err, dataset) => {
      if (err) return res.status(500).send(err);
      else return res.status(200).send(dataset);
    }, null);
  });

  router.post('/produit', (req, res) => {
    produitModel.create((err, dataset) => {
      if (err) return res.status(500).send(err);
      else return res.status(200).send(dataset);
    }, req.body);
  });
  
  router.patch('/produit', (req, res) => {
    produitModel.update((err, dataset) => {
      if (err) return res.status(500).send(err);
      else return res.status(200).send(dataset);
    }, req.body);
  });
  
  router.delete('/produit', (req, res) => {
    produitModel.remove((err, dataset) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(dataset);
    }, req.body.id);
  });
  
  return router;
};

module.exports = produitAPi;
