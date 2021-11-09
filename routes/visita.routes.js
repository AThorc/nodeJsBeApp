module.exports = app => {
    const visitas = require("../controllers/visita.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Visita
    router.post("/", visitas.create);
  
    // Retrieve all Visitas with specific conditions
    router.get("/", visitas.findAll);
  
    // Retrieve all published Visitas
    //router.get("/published", visitas.findAllPublished);
  
    // Retrieve a single Visita with id
    router.get("/:id", visitas.findOne);
  
    // Update a Visita with id
    router.put("/:id", visitas.update);
  
    // Delete a Visita with id
    router.delete("/:id", visitas.delete);
  
    // Create a new Visita
    //router.delete("/", visitas.deleteAll);


    // Retrieve Visita with userid
    router.get("/:userid", visitas.findByConditions);
    
    // Delete a Visita with userid
    //router.delete("/:userid", visitas.delete);

  
    app.use('/api/visitas', router);
  };