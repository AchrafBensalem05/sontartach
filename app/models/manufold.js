const mongoose = require('mongoose');

const manufoldSchema = new mongoose.Schema({
  ID: { type: mongoose.Schema.Types.ObjectId, ref:"Infrastracture", required: true },
  pression: { type: Number, required: true },
  temp: { type: Number, required: true },
});

const Manufold = mongoose.model('Manufold', manufoldSchema);

module.exports = Manufold;
