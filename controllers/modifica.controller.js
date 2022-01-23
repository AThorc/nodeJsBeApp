const db = require("../models");
const Modifica = db.modificas;



// Retrieve all Modificas from the database even by clientId.
exports.findAll = (req, res) => {

  Modifica.find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving modificas."
      });
    });
};


// Find a single Modifica with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Modifica.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Modifica with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Modifica with id=" + id });
      });
};
