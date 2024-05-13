const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const cron = require('node-cron');
const axios = require('axios');

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
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
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
// require("./app/routes/well.routes")

const wellRoutes = require('./app/routes/well.routes');
const Well = require('./app/models/well'); // Import the Well model
const telemetryRoutes = require('./app/routes/telemetry.routes')
const telemetry = require('./app/models/telemetry')
const pipeRoutes = require('./app/routes/pipe.routes'); // Import the wellRoutes
const Pipe = require('./app/models/pipe');
const manufoldRoutes = require('./app/routes/manufold.routes')
const Manufold = require("./app/models/manufold")
const inspectionRoutes= require('./app/routes/inspection.routes')

// Use the wellRoutes for handling well-related routes
app.use('/pipe',pipeRoutes)
app.use('/well', wellRoutes);
app.use('/manufold',manufoldRoutes);
app.use('/inspection', inspectionRoutes);
app.use('/telemetry',telemetryRoutes)

cron.schedule('*/100 * * * *', async () => {
  try {
      const telemetryData = {
          ID: '6633d0ebb0710cd83a14a0d0',
          date: new Date(),
          attributes: [
              {name:"pressure", value: Math.random()*10+20},// Your pressure data,
              {name:"temperature", value:Math.random()*10+20} // Your temperature data
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






