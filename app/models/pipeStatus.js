const mongoose = require('mongoose');

const pipeStatusSchema = new mongoose.Schema({
  pipe_id: { type: mongoose.Schema.Types.ObjectId,ref:"Pipe" },
  name:{type:String },// create enum mb3d
  date: { type: Date } ///lazm t7a6 format s7i7a ta3 date
});

const PipeStatus = mongoose.model('PipeStatus', pipeStatusSchema);

module.exports = PipeStatus;
