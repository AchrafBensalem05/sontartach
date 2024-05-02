const mongoose = require('mongoose');

const InfrastructureSchema = new mongoose.Schema({
  coord_id: { type: mongoose.Schema.Types.ObjectId, ref:'coord', required: true },
});

module.exports = mongoose.model('Infrastracture', InfrastructureSchema);