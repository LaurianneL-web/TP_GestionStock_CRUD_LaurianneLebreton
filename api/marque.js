/* jshint esversion : 6 */

const marqueAPi = function marqueAPi(connection) {

    const router = require("express").Router();
    const marqueModel = require("./../model/marque")(connection);
  
    router.get('/marque/:id', (req, res) => {
      marqueModel.get((err, dataset) => {
        if (err) return res.status(500).send(err);
        else return res.status(200).send(dataset[0]);
      }, req.params.id);
    });
  
    router.get('/marque', (req, res) => {
      marqueModel.get( (err, dataset) => {
        if (err) return res.status(500).send(err);
        else return res.status(200).send(dataset);
      }, null);
    });
  
    router.post('/marque', (req, res) => {
      marqueModel.create((err, dataset) => {
        if (err) return res.status(500).send(err);
        else return res.status(200).send(dataset);
      }, req.body); // post datas ici ...
    });
    
    router.patch('/marque', (req, res) => {
      marqueModel.update((err, dataset) => {
        if (err) return res.status(500).send(err);
        else return res.status(200).send(dataset);
      }, req.body); // un tableau d'ids ici ...
    });
    
    router.delete('/marque', (req, res) => {
      marqueModel.remove((err, dataset) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(dataset);
      }, req.body.id); // tableau d'ids ici ...
    });
    
    return router;
  };
  
  module.exports = marqueAPi;
  