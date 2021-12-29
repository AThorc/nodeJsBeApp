module.exports = app => {
    const legames = require("../controllers/legame.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", legames.create);
  
    // Retrieve all Tutorials
    router.get("/", legames.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", legames.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", legames.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", legames.delete);
  
    // Create a new Tutorial
    router.delete("/", legames.deleteAll);
  
    app.use('/api/legames', router);
  };