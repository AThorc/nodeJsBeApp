const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path")

const app = express();

var corsOptions = {
  //origin: process.env.REACT_APP_HEROKU_URL || "http://localhost:8081"
  origin: [process.env.REACT_APP_HEROKU_URL, process.env.REACT_APP_HEROKU_HTTP_URL,"http://localhost:8081"]
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "client", "build")))

const db = require("./models");
const Role = db.role;

db.mongoose
  .connect((process.env.MONGODB_MULTIFINANCESERVICE_URI || db.url), {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
    initial();
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to torcetta application." });
});

// routes
require("./routes/tutorial.routes")(app);
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/visita.routes')(app);
require('./routes/cliente.routes')(app);
require('./routes/servizio.routes')(app);
require('./routes/partner.routes')(app);
require('./routes/segnalatore.routes')(app);
require('./routes/contatto.routes')(app);
require('./routes/legame.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}