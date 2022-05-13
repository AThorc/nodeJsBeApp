const db = require("../models");
const Partner = db.partners;
const Modifica = db.modificas;

// Create and Save a new Partner
exports.create = (req, res) => {
    // Validate request
    if (!req.body.denominazione && !req.body.dataCostituzione) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
  
    // Create a Partner
    const partner = new Partner({
      servizioid: req.body.servizioid,
      denominazione: req.body.denominazione,
      dataInizio: req.body.dataInizio,
      fatturatoPartner: req.body.fatturatoPartner,
      userid: req.body.userid,
      username: req.body.username,
      percentuale: req.body.percentuale,
    });
  
    // Save Partner in the database
    partner
      .save(partner)
      .then(data => {
        res.send(data);
        //Creo il record di modifica
        const modifica = new Modifica({
          partnerid : partner.id,
          data: new Date(),
          userid: partner.userid,
          username: partner.username,
        });
        modifica.save(modifica);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Partner."
        });
      });
};

// Retrieve all Partners from the database.
/*
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
  
    Partner.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving partners."
        });
      });
};
*/

// Retrieve all Partners from the database even by clientId.
exports.findAll = (req, res) => {
  const denominazione = req.query.denominazione;      
  var condition = denominazione ? { denominazione: { $regex: new RegExp(denominazione), $options: "i" } } : {};

  Partner.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving partners."
      });
    });
};


// Find a single Partner with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Partner.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Partner with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Partner with id=" + id });
      });
};

// Update a Partner by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Partner.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Partner with id=${id}. Maybe Partner was not found!`
          });
        } else{
           //Creo il record di modifica
          const modifica = new Modifica({
            partnerid : id,
            data: new Date(),
            userid: req.body.userid,
            username: req.body.username,

          });
          modifica.save(modifica);
          res.send({ message: "Partner was updated successfully." });
        } 
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Partner with id=" + id
        });
      });
};
// Delete a Partner with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Partner.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Partner with id=${id}. Maybe Partner was not found!`
          });
        } else {
          res.send({
            message: "Partner was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Partner with id=" + id
        });
      });
};

// Delete all Partners from the database.
exports.deleteAll = (req, res) => {
    Partner.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Partners were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all partners."
        });
      });
};