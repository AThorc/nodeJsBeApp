module.exports = app => {
    const contattos = require("../controllers/contatto.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", contattos.create);
  
    // Retrieve all Tutorials
    router.get("/", contattos.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", contattos.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", contattos.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", contattos.delete);
  
    // Create a new Tutorial
    router.delete("/", contattos.deleteAll);
  
    app.use('/api/contattos', router);
  };