const mongoose = require('mongoose');

const ConstructionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  message: { type: String },
  ficher: { type: String },
  ID:{ type: Number },
  user:{ type:mongoose.Schema.Types.ObjectId,ref:'User'},
});

const Construction = mongoose.model('Construction', ConstructionSchema);

module.exports = Construction;
