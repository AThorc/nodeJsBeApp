const db = require("../models");
const Legame = db.legames;

const mongoose = require('mongoose');

// Create and Save a new Legame
exports.create = (req, res) => {
    // Validate request
    if (!req.body.tipo || !req.body.servizioid || !req.body.clienteid || !req.body.partnerid) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
  
    // Create a Legame
    const legame = new Legame({
      clienteid: req.body.clienteid,      
      partnerid: req.body.partnerid,
      segnalatoreid: req.body.segnalatoreid,
      tipo: req.body.tipo,
      servizioid: req.body.servizioid,
      fatturatoPartner: req.body.fatturatoPartner,
      fatturatoSocieta: req.body.fatturatoSocieta
    });
  
    // Save Legame in the database
    legame
      .save(legame)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Legame."
        });
      });
};

// Retrieve all Legames from the database.
/*
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
  
    Legame.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving legames."
        });
      });
};
*/

// Retrieve all Legames from the database even by servizioid.
exports.findAll = (req, res) => {
  const servizioid = new mongoose.Types.ObjectId(req.query.servizioid);
  const clienteid = new mongoose.Types.ObjectId(req.query.clienteid);
  const partnerid = new mongoose.Types.ObjectId(req.query.partnerid);
  var condition = req.query.servizioid ? { servizioid: servizioid} : {};
  condition = req.query.servizioid && req.query.clienteid ? { servizioid: servizioid, clienteid: clienteid } :condition;
  condition = !req.query.servizioid && req.query.partnerid ? { partnerid: partnerid } :condition;

  Legame.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving legames."
      });
    });
};


// Find a single Legame with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Legame.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Legame with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Legame with id=" + id });
      });
};

// Update a Legame by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Legame.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Legame with id=${id}. Maybe Legame was not found!`
          });
        } else res.send({ message: "Legame was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Legame with id=" + id
        });
      });
};
// Delete a Legame with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Legame.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Legame with id=${id}. Maybe Legame was not found!`
          });
        } else {
          res.send({
            message: "Legame was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Legame with id=" + id
        });
      });
};

// Delete all Legames from the database.
exports.deleteAll = (req, res) => {
    Legame.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Legames were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all legames."
        });
      });
};