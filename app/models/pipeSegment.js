const mongoose = require('mongoose');
const type = require('./type');


const attributeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
});

const pipeSegmentSchema = new mongoose.Schema({
  pipeId: { type: mongoose.Schema.Types.ObjectId, ref:"Pipe"},
  coor_id: [{ type: mongoose.Schema.Types.ObjectId, ref:'Coord' }],
  attributes: [attributeSchema]
});


// thikness: { type: Number },
//   dia: { type: Number },
//   length: { type: Number },
//   instalationYear: { type: Date },
//   ep_nom: { type: Number },
//   ep_min: { type: Number }
const PipeSegment = mongoose.model('PipeSegment', pipeSegmentSchema);

module.exports = PipeSegment;
