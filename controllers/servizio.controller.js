const db = require("../models");
const Servizio = db.servizios;

// Create and Save a new Servizio
exports.create = (req, res) => {
    // Validate request
    if (!req.body.servizi && !req.body.dataInizio) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
  
    // Create a Servizio
    const servizio = new Servizio({
      clienteid: req.body.clienteid,
      servizi: req.body.servizi,
      partnerid: req.body.partnerid,
      segnalatoreid: req.body.segnalatoreid,
      tipo: req.body.tipo,
      dataInizio: req.body.dataInizio,
      fatturato: req.body.fatturato
    });
  
    // Save Servizio in the database
    servizio
      .save(servizio)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Servizio."
        });
      });
};

// Retrieve all Servizios from the database.
/*
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
  
    Servizio.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving servizios."
        });
      });
};
*/

// Retrieve all Servizios from the database even by clientId.
exports.findAll = (req, res) => {
  const clientId = req.query.clientId;      
  var condition = clientId ? { clientId: { $regex: new RegExp(clientId), $options: "i" } } : {};

  Servizio.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving servizios."
      });
    });
};


// Find a single Servizio with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Servizio.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Servizio with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Servizio with id=" + id });
      });
};

// Update a Servizio by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Servizio.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Servizio with id=${id}. Maybe Servizio was not found!`
          });
        } else res.send({ message: "Servizio was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Servizio with id=" + id
        });
      });
};
// Delete a Servizio with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Servizio.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Servizio with id=${id}. Maybe Servizio was not found!`
          });
        } else {
          res.send({
            message: "Servizio was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Servizio with id=" + id
        });
      });
};

// Delete all Servizios from the database.
exports.deleteAll = (req, res) => {
    Servizio.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Servizios were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all servizios."
        });
      });
};