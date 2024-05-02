const mongoose = require('mongoose');

const pipeSegmentSchema = new mongoose.Schema({
  ID: { type: Number, required: true },
  pipeId: { type: mongoose.Schema.Types.ObjectId, ref:"Pipe", required: true },
  coor_id: [{ type: mongoose.Schema.Types.ObjectId, ref:'Coord' }],
  thikness: { type: Number },
  dia: { type: Number },
  length: { type: Number },
  instalationYear: { type: Date },
  ep_nom: { type: Number },
  ep_min: { type: Number }
});

const PipeSegment = mongoose.model('PipeSegment', pipeSegmentSchema);

module.exports = PipeSegment;
