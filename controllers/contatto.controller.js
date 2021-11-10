const db = require("../models");
const Contatto = db.contattos;

// Create and Save a new Contatto
exports.create = (req, res) => {
    // Validate request
    if (!req.body.denominazione && !req.body.dataCostituzione) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
  
    // Create a Contatto
    const contatto = new Contatto({
      clienteid: req.body.clienteid,
      dataContatto: req.body.dataContatto,
      tipoContatto: req.body.tipoContatto,
      note: req.body.note
    });
  
    // Save Contatto in the database
    contatto
      .save(contatto)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Contatto."
        });
      });
};

// Retrieve all Contattos from the database.
/*
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
  
    Contatto.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving contattos."
        });
      });
};
*/

// Retrieve all Contattos from the database even by clientId.
exports.findAll = (req, res) => {
  const clientId = req.query.clientId;      
  var condition = clientId ? { clientId: { $regex: new RegExp(clientId), $options: "i" } } : {};

  Contatto.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving contattos."
      });
    });
};


// Find a single Contatto with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Contatto.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Contatto with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Contatto with id=" + id });
      });
};

// Update a Contatto by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Contatto.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Contatto with id=${id}. Maybe Contatto was not found!`
          });
        } else res.send({ message: "Contatto was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Contatto with id=" + id
        });
      });
};
// Delete a Contatto with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Contatto.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Contatto with id=${id}. Maybe Contatto was not found!`
          });
        } else {
          res.send({
            message: "Contatto was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Contatto with id=" + id
        });
      });
};

// Delete all Contattos from the database.
exports.deleteAll = (req, res) => {
    Contatto.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Contattos were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all contattos."
        });
      });
};