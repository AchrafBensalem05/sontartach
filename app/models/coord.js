const mongoose = require('mongoose');

const coordSchema = new mongoose.Schema({
  longitude: { type: Number },
  latitude: { type: Number },
  elevation: { type: Number },
  idAdr:{type: mongoose.Schema.Types.ObjectId, ref:"Address"}
});

const Coord = mongoose.model('Coord', coordSchema);

module.exports = Coord;
