const db = require("../models");
const Cliente = db.clientes;
const mongoose = require('mongoose');


// Create and Save a new Cliente
exports.create = (req, res) => {
    // Validate request
    if (!req.body.codiceFiscale && !req.body.partitaIVA) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
  
    // Create a Cliente
    const cliente = new Cliente({
      ragioneSocialeid: req.body.ragioneSocialeid,
      codiceFiscale: req.body.codiceFiscale,
      partitaIVA: req.body.partitaIVA,
      legaleRappresentate: req.body.legaleRappresentate,
      telefono: req.body.telefono,
      cellulare: req.body.cellulare,
      mail: req.body.mail,
      pec: req.body.pec,
      sede: req.body.sede,
      localita: req.body.localita,
      cap: req.body.cap,
      //Unica entità
      ragioneSociale: req.body.ragioneSociale,      
      dataCostituzione: req.body.dataCostituzione,
      inizioAttivita: req.body.inizioAttivita,
      tipo: req.body.tipo,
      dimensione: req.body.dimensione,
      attIstatAteco2007: req.body.attIstatAteco2007,
      settore: req.body.settore
    });
  
    // Save Cliente in the database
    cliente
      .save(cliente)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Cliente."
        });
      });
};

// Retrieve all Clientes from the database.
exports.findAll = (req, res) => {
    const ragioneSociale = req.query.ragioneSociale;
    const partners = new mongoose.Types.ObjectId(req.query.partners);
    //const partners = new mongoose.ObjectId(req.query.partners);    
    var condition = ragioneSociale ? { ragioneSociale: { $regex: new RegExp(ragioneSociale), $options: "i" } } : {};
    condition = !ragioneSociale && partners ? { partners: partners } : {};

    Cliente.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving clientes."
        });
      });
};

// Find a single Cliente with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Cliente.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Cliente with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Cliente with id=" + id });
      });
};

// Update a Cliente by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Cliente.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Cliente with id=${id}. Maybe Cliente was not found!`
          });
        } else res.send({ message: "Cliente was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Cliente with id=" + id
        });
      });
};
// Delete a Cliente with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Cliente.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Cliente with id=${id}. Maybe Cliente was not found!`
          });
        } else {
          res.send({
            message: "Cliente was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Cliente with id=" + id
        });
      });
};

// Delete all Clientes from the database.
exports.deleteAll = (req, res) => {
    Cliente.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Clientes were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all clientes."
        });
      });
};