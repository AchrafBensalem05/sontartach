const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
});

const telemetrySchema = new mongoose.Schema({
  ID:{type:mongoose.Schema.Types.ObjectId, ref:"Infrastracture" },
  date: { type: Date, required: true },
  attributes: [attributeSchema]
});
const Telemetry = mongoose.model('Telemetry', telemetrySchema);

module.exports = Telemetry;
