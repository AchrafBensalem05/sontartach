const mongoose = require('mongoose');

const EpNoteSchema = new mongoose.Schema({
  email:{ type: String },
  message: { type: String },
  ficher: { type: String },
  date: { type: Date, required: true },
  ID:{ type: Number }
  
});

const EpNote = mongoose.model('EpNote', EpNoteSchema);

module.exports = EpNote;
