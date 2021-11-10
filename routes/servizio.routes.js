module.exports = app => {
    const servizios = require("../controllers/servizio.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", servizios.create);
  
    // Retrieve all Tutorials
    router.get("/", servizios.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", servizios.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", servizios.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", servizios.delete);
  
    // Create a new Tutorial
    router.delete("/", servizios.deleteAll);
  
    app.use('/api/servizios', router);
  };