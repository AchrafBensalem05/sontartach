const mongoose = require('mongoose');


const attributeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
});



const manufoldSchema = new mongoose.Schema({
  ID: { type: mongoose.Schema.Types.ObjectId, ref:"Infrastracture" },
  name: { type: String, required: true },
  attributes: [attributeSchema]
});

const Manufold = mongoose.model('Manufold', manufoldSchema);

module.exports = Manufold;
