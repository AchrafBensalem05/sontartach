const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  ID: { type: Number, required: true },
  centre: { type: String },
  region: { type: String },
  zone: { type: String },
  wilaya: { type: String },
  
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
