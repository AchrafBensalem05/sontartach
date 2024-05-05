const mongoose = require('mongoose');
const connection = require('./connection');
const nature = require('./nature')
const type = require('./type')

const pipeSchema = new mongoose.Schema({
  from_id: { type: mongoose.Schema.Types.ObjectId, ref:"Infrastracture", required:true },
  to_id: { type: mongoose.Schema.Types.ObjectId, ref:"Infrastracture", required:true},
  coord_ids:[{type:mongoose.Schema.Types.ObjectId, ref:"Coord", required:true}],
  length: { type: Number , required:true},
  connectionType: { type: String, enum: connection, default: 'direct' }, 
  type: { type: String, enum: type, default: 'collect' }, 
  nature: { type: String, enum: nature, default:'oil' }
});

const Pipe = mongoose.model('Pipe', pipeSchema);

module.exports = Pipe;
