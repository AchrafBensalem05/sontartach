const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
const mongoose = require('mongoose');
const cron = require('node-cron');
const axios = require('axios');
const EventEmitter = require('events');
const dbConfig = require("./app/config/db.config");
const { initSocket } = require('./app/socket'); // Importing socket setup
const notificationRoutes = require('./app/routes/notification.routes'); // Importing notification routes

// Create an instance of EventEmitter
const emitter = new EventEmitter();

// Set the maximum number of listeners for the event emitter
emitter.setMaxListeners(15); // Adjust the limit as per your needs

const app = express();
const server = http.createServer(app);
initSocket(server); // Initialize socket with server

app.use(cookieParser());

var corsOptions = {
  origin: "http://localhost:3000",
  credentials: true // Allow cookies to be sent
};

// parse requests of content-type - application/json
app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));
app.use(cors(corsOptions));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connected to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require("./app/routes/user.routes")(app);

const wellRoutes = require('./app/routes/well.routes');
const Well = require('./app/models/well');
const telemetryRoutes = require('./app/routes/telemetry.routes');
const telemetry = require('./app/models/telemetry');
const pipeRoutes = require('./app/routes/pipe.routes');
const Pipe = require('./app/models/pipe');
const manufoldRoutes = require('./app/routes/manufold.routes');
const Manufold = require("./app/models/manufold");
const inspectionRoutes= require('./app/routes/inspection.routes');
const authentication= require('./app/routes/auth.routes');
const junctionRoutes= require('./app/routes/junction.routes');
const epNoteRoutes= require('./app/routes/epnote.routes');
const inspectionDepReport= require('./app/routes/inpectionDepReport.routes');
const evaluation= require('./app/routes/evaluation.routes');
const construction= require('./app/routes/construction.routes');
const constructionStatus= require('./app/routes/ConstructionRaportStatus.routes');

// Use the routes for handling related endpoints
app.use('/pipe', pipeRoutes);
app.use('/well', wellRoutes);
app.use('/manifold', manufoldRoutes);
app.use('/inspection', inspectionRoutes);
app.use('/telemetry', telemetryRoutes);
app.use('/auth', authentication);
app.use('/junction', junctionRoutes);
app.use('/epnote', epNoteRoutes);
app.use('/inpectionReport', inspectionDepReport);
app.use('/evaluation', evaluation);
app.use('/construction', construction);
app.use('/constructionStatus', constructionStatus);

app.use('/notifications', notificationRoutes);

cron.schedule('* * * * *', async () => {
  try {
    const telemetryData = {
      ID: '6633d0ebb0710cd83a14a0d0',
      date: new Date(),
      attributes: [
        { name: "pressure", value: Math.random() * 10 + 20 }, // Your pressure data
        { name: "temperature", value: Math.random() * 10 + 20 } // Your temperature data
      ]
    };
    await axios.post('http://localhost:8080/telemetry/create', telemetryData);
    console.log('Telemetry data sent successfully.');
  } catch (err) {
    console.error('Error sending telemetry data:', err);
  }
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "viewer"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "pipeAdmin"
      }).save(err => { 
        if (err) {
          console.log("error", err);
        }
        console.log("added 'pipeAdmin' to roles collection");
      });

      new Role({
        name: "wellAdmin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'wellAdmin' to roles collection");
      });

      new Role({
        name: "manufoldAdmin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'manufoldAdmin' to roles collection");
      });

      new Role({
        name: "inspectionAdmin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'inspectionAdmin' to roles collection");
      });
    }
  });
}
