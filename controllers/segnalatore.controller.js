const db = require("../models");
const Segnalatore = db.segnalatores;

// Create and Save a new Segnalatore
exports.create = (req, res) => {
    // Validate request
    if (!req.body.denominazione && !req.body.dataCostituzione) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
  
    // Create a Segnalatore
    const segnalatore = new Segnalatore({
      servizioid: req.body.servizioid,
      denominazione: req.body.denominazione,
      dataInizio: req.body.dataInizio,
      fatturatoSegnalatore: req.body.fatturatoSegnalatore
    });
  
    // Save Segnalatore in the database
    segnalatore
      .save(segnalatore)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Segnalatore."
        });
      });
};

// Retrieve all Segnalatores from the database.
/*
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
  
    Segnalatore.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving segnalatores."
        });
      });
};
*/

// Retrieve all Segnalatores from the database even by clientId.
exports.findAll = (req, res) => {
  const denominazione = req.query.denominazione;      
  var condition = denominazione ? { denominazione: { $regex: new RegExp(denominazione), $options: "i" } } : {};

  Segnalatore.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving segnalatores."
      });
    });
};


// Find a single Segnalatore with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Segnalatore.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Segnalatore with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Segnalatore with id=" + id });
      });
};

// Update a Segnalatore by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Segnalatore.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Segnalatore with id=${id}. Maybe Segnalatore was not found!`
          });
        } else res.send({ message: "Segnalatore was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Segnalatore with id=" + id
        });
      });
};
// Delete a Segnalatore with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Segnalatore.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Segnalatore with id=${id}. Maybe Segnalatore was not found!`
          });
        } else {
          res.send({
            message: "Segnalatore was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Segnalatore with id=" + id
        });
      });
};

// Delete all Segnalatores from the database.
exports.deleteAll = (req, res) => {
    Segnalatore.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Segnalatores were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all segnalatores."
        });
      });
};