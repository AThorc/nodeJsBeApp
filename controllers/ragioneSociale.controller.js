const db = require("../models");
const RagioneSociale = db.ragioneSociales;

// Create and Save a new RagioneSociale
exports.create = (req, res) => {
    // Validate request
    if (!req.body.denominazione && !req.body.dataCostituzione) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
  
    // Create a RagioneSociale
    const ragioneSociale = new RagioneSociale({
      denominazione: req.body.denominazione,
      dataCostituzione: req.body.dataCostituzione,
      inizioAttivita: req.body.inizioAttivita,
      tipo: req.body.tipo,
      dimensione: req.body.dimensione,
      attIstatAteco2007: req.body.attIstatAteco2007,
      settore: req.body.settore       
    });
  
    // Save RagioneSociale in the database
    ragioneSociale
      .save(ragioneSociale)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the RagioneSociale."
        });
      });
};

// Retrieve all RagioneSociales from the database.
exports.findAll = (req, res) => {
    const denominazione = req.query.denominazione;
    var condition = denominazione ? { denominazione: { $regex: new RegExp(denominazione), $options: "i" } } : {};
  
    RagioneSociale.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving ragioneSociales."
        });
      });
};

// Find a single RagioneSociale with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    RagioneSociale.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found RagioneSociale with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving RagioneSociale with id=" + id });
      });
};

// Update a RagioneSociale by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    RagioneSociale.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update RagioneSociale with id=${id}. Maybe RagioneSociale was not found!`
          });
        } else res.send({ message: "RagioneSociale was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating RagioneSociale with id=" + id
        });
      });
};
// Delete a RagioneSociale with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    RagioneSociale.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete RagioneSociale with id=${id}. Maybe RagioneSociale was not found!`
          });
        } else {
          res.send({
            message: "RagioneSociale was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete RagioneSociale with id=" + id
        });
      });
};

// Delete all RagioneSociales from the database.
exports.deleteAll = (req, res) => {
    RagioneSociale.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} RagioneSociales were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all ragioneSociales."
        });
      });
};