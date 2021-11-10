module.exports = app => {
    const partners = require("../controllers/partner.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", partners.create);
  
    // Retrieve all Tutorials
    router.get("/", partners.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", partners.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", partners.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", partners.delete);
  
    // Create a new Tutorial
    router.delete("/", partners.deleteAll);
  
    app.use('/api/partners', router);
  };