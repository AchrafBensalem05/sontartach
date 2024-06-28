const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({

  ouvrage: { type: String },
  ouvrage_type: { type: String }, 
  inspection_date: { type: Date, required: true },
  status:{type: String},
  observation: { type: String },
  user:{ type:mongoose.Schema.Types.ObjectId,ref:'User'},
  ep_noteID: { type:mongoose.Schema.Types.ObjectId,ref:'EpNote'},
  Ins_reportID: { type:mongoose.Schema.Types.ObjectId,ref:'InspectionDepReport'},
  evaluationID: { type:mongoose.Schema.Types.ObjectId,ref:'Evaluation'},
  constructionID: { type:mongoose.Schema.Types.ObjectId,ref:'Construction'},
});

const Inspection = mongoose.model('Inspection', inspectionSchema);

module.exports = Inspection;
