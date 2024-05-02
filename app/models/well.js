const mongoose = require('mongoose');

const wellSchema = new mongoose.Schema({
  ID: { type: mongoose.Schema.Types.ObjectId, ref:"Coord" },
  order_date: { type: Date },
  gor: { type: Number },
  oil: { type: Number },
  gas: { type: Number }
});

const Well = mongoose.model('Well', wellSchema);

module.exports = Well;
