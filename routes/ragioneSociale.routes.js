module.exports = app => {
    const ragioneSociales = require("../controllers/ragioneSociale.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", ragioneSociales.create);
  
    // Retrieve all Tutorials
    router.get("/", ragioneSociales.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", ragioneSociales.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", ragioneSociales.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", ragioneSociales.delete);
  
    // Create a new Tutorial
    router.delete("/", ragioneSociales.deleteAll);
  
    app.use('/api/ragioneSociales', router);
  };