module.exports = app => {
    const modificas = require("../controllers/modifica.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all Modificas
    router.get("/", modificas.findAll);
  
    // Retrieve a single Modifica with id
    router.get("/:id", modificas.findOne);
  
  
    app.use('/api/modificas', router);
  };