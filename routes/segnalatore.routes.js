module.exports = app => {
    const segnalatores = require("../controllers/segnalatore.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", segnalatores.create);
  
    // Retrieve all Tutorials
    router.get("/", segnalatores.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", segnalatores.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", segnalatores.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", segnalatores.delete);
  
    // Create a new Tutorial
    router.delete("/", segnalatores.deleteAll);
  
    app.use('/api/segnalatores', router);
  };