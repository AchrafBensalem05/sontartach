const mongoose = require('mongoose');
const connection = require('./connection');
const nature = require('./nature')
const type = require('./type')

const pipeSchema = new mongoose.Schema({
  ID: { type: Number, required: true },
  from_id: { type: mongoose.Schema.Types.ObjectId, ref:"Infrastracture" },
  to_id: { type: mongoose.Schema.Types.ObjectId,ref:"Infrastracture"},
  length: { type: Number },
  connectionType: { type: String, enum: connection, default: 'direct' }, 
  type: { type: String, enum: type, default: 'collect' }, 
  nature: { type: String, enum: nature, default:'oil' }
});

const Pipe = mongoose.model('Pipe', pipeSchema);

module.exports = Pipe;
