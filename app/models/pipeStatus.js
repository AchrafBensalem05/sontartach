const mongoose = require('mongoose');

const pipeStatusSchema = new mongoose.Schema({
  pipe_id: { type: mongoose.Schema.Types.ObjectId,ref:"Pipe" },
  inspection_id: { type: mongoose.Schema.Types.ObjectId,ref:"Inspection" },

  status:{type:String },// create enum mb3d
  next_inspection: { type: Date },
  observation:{type:String } ///lazm t7a6 format s7i7a ta3 date
});

const PipeStatus = mongoose.model('PipeStatus', pipeStatusSchema);

module.exports = PipeStatus;
