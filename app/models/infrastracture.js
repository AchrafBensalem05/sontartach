const mongoose = require('mongoose');

const InfrastructureSchema = new mongoose.Schema({
  ID: { type: Number, required: true },
  coord_id: { type: mongoose.Schema.Types.ObjectId, ref:'coord', required: true },
});

module.exports = mongoose.model('Infrastructure', InfrastructureSchema);