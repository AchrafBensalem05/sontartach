const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  result:{ type: String },
  date: { type: Date, required: true },
  message: { type: String },
  ficher: { type: String },
  ID:{ type: Number },
  user:{ type:mongoose.Schema.Types.ObjectId,ref:'User'},

});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

module.exports = Evaluation;
