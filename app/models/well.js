const mongoose = require('mongoose');
const { type } = require('.');

const attributeSchema = new mongoose.Schema({
  name: { type: String,  },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
});
//don't forget to add required to names 
const wellSchema = new mongoose.Schema({
  ID:{type:mongoose.Schema.Types.ObjectId, ref:"Infrastracture" },
  name: { type: String},
  attributes: [attributeSchema],
  order_date:{type: Date}
});
const Well = mongoose.model('Well', wellSchema);

module.exports = Well;
