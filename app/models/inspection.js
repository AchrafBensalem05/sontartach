const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({
  ID: { type: Number, required: true },
  pipeID: { type: mongoose.Schema.Types.ObjectId, required: true },
  Inspection_date: { type: Date, required: true },
  observation: { type: String },
  ficher: { type: String },
});

const Inspection = mongoose.model('Inspection', inspectionSchema);

module.exports = Inspection;
