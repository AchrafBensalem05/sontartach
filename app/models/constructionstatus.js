const mongoose = require('mongoose');

const constructionstatusSchema = new mongoose.Schema({
  InspectionID: { type:mongoose.Schema.Types.ObjectId,ref:'Inspection', required: true },
  date: { type: Date, required: true },
  status: { type: String },
});

const ConstructionStatus = mongoose.model('ConstructionStatus', constructionstatusSchema);

module.exports = ConstructionStatus;
