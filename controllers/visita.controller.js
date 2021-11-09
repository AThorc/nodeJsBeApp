const db = require("../models");
const Visita = db.visitas;

// Create and Save a new Visita
exports.create = (req, res) => {
    // Validate request
    if (!req.body.userid) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
  
    // Create a Visita
    const visita = new Visita({
      luogo: req.body.luogo,
      userid: req.body.userid,
      data_avvio: req.body.data_avvio,
      data_scadenza: req.body.data_scadenza,
      nomePaziente: req.body.nomePaziente,
      cognomePaziente: req.body.cognomePaziente,
    });
  
    // Save Visita in the database
    visita
      .save(visita)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Visita."
        });
      });
};

// Retrieve all Visitas from the database.
exports.findAll = (req, res) => {
    const userid = req.query.userid;
    const luogo = req.query.luogo;
    var condition = luogo ? { userid:userid, luogo: { $regex: new RegExp(luogo), $options: "i" } } : {userid:userid};
  
    Visita.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving visitas."
        });
      });
};

// Find all Visita with an userid or id
exports.findByConditions = (req, res) => {
  const id = req.params.id;
  
  Visita.find({ $or: [
    {"_id" :id},
    {"userid" :id},
  ]})
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Visita with findId " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Visita with findId=" + id });
    });    
};

// Find a single Visita with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Visita.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Visita with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Visita with id=" + id });
    });
};


// Update a Visita by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Visita.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Visita with id=${id}. Maybe Visita was not found!`
          });
        } else res.send({ message: "Visita was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Visita with id=" + id
        });
      });
};
// Delete a Visita with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Visita.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Visita with id=${id}. Maybe Visita was not found!`
          });
        } else {
          res.send({
            message: "Visita was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Visita with id=" + id
        });
      });
};

// Delete all Visitas from the database.
/*
exports.deleteAll = (req, res) => {
    Visita.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Visitas were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all visitas."
        });
      });
};
*/

// Find all published Visitas
/*
exports.findAllPublished = (req, res) => {
    Visita.find({ published: true })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving visitas."
        });
      });
};
*/