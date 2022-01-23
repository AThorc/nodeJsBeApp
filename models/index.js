const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.tutorials = require("./tutorial.model.js")(mongoose);

db.user = require("./user.model");
db.role = require("./role.model");

db.visitas = require("./visita.model.js")(mongoose);

db.ROLES = ["user", "admin", "moderator"];

db.clientes = require("./cliente.model.js")(mongoose);
db.servizios = require("./servizio.model.js")(mongoose);
db.partners = require("./partner.model.js")(mongoose);
db.segnalatores = require("./segnalatore.model.js")(mongoose);
db.contattos = require("./contatto.model.js")(mongoose);
db.legames = require("./legame.model.js")(mongoose);
db.modificas = require("./modifica.model.js")(mongoose);

module.exports = db;