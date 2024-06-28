const mongoose = require('mongoose');

const InspectionDepReportSchema = new mongoose.Schema({
  version:{ type: String },
  date: { type: Date, required: true },
  message: { type: String },
  ficher: { type: String },
  ID:{ type: Number },
  user:{ type:mongoose.Schema.Types.ObjectId,ref:'User'},

});

const InspectionDepReport = mongoose.model('InspectionDepReport', InspectionDepReportSchema);

module.exports = InspectionDepReport;
