/* jshint esversion : 6 */

const express = require("express");
const port = 5555;
const app = express();
const baseURL = `http://localhost:${port}`;
const api = require(__dirname + "/api")(app);
var connectionOnce = false;
// APP CONFIG !!!
app.use(express.json({extended: false}));
app.use(api.prefix, api.routers);
// définition de ressources statiques...
app.use(express.static(__dirname + '/assets'));

//LOGIN
app.post("/api/v1/login", function(req, res) {
  if(req.body.username === "admin" && req.body.password === "biz123") {
    connectionOnce = true;
    res.send({loc: `${baseURL}/stock-manager`});
    return;
  } else {
    res.send(JSON.stringify({message: "Votre identifiant ou mot de passe est incorrect."}));
  }
});

app.patch("/api/v1/login", function(req, res) {
  console.log(req.body);
  connectionOnce = false;
});
// ROUTES DES PAGES DE l'APPLICATION
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/view/index.html');
});

app.get("/stock-manager", function(req, res) {
  if(connectionOnce){
    res.sendFile( __dirname + '/view/stock-manager.html');
  } else{
    res.redirect('/');
  }
});

app.listen(port, function() {
  console.log("node server started on port " + port);
});
