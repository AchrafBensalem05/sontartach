const mongoose = require('mongoose');

const wellTypeSchema = new mongoose.Schema({
  well_id: { type: mongoose.Schema.Types.ObjectId,ref:"Well" },
  type:{type:String },// create enum mb3d
  date: { type: Date }
});

const WellType = mongoose.model('WellType', wellTypeSchema);

module.exports = WellType;
