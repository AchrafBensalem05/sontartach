const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.address = require("./address")
db.connection= require("./connection")
db.coord = require("./coord")
db.infrastracture = require("./infrastracture")
db.inspection =  require("./inspection")
db.manufold = require("./manufold")
db.nature =  require("./nature")
db.pipe = require("./pipe")
db.pipeSegment = require("./pipeSegment")
db.type= require("./type")
db.well = require("./well")
db.wellType= require("./wellType")
// db.welll = require("./well2")


db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
//hello 