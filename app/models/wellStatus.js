const mongoose = require('mongoose');

const wellStatusSchema = new mongoose.Schema({
  well_id: { type: mongoose.Schema.Types.ObjectId,ref:"Manifold" },
  inspection_id: { type: mongoose.Schema.Types.ObjectId,ref:"Inspection" },
  status:{type:String },// create enum mb3d
  next_inspection: { type: Date },
  observation:{type:String }
});

const WellStatus = mongoose.model('PipeStatus', wellStatusSchema);

module.exports = WellStatus;
