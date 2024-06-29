const mongoose = require("mongoose");

const ouvrageStatusSchema = new mongoose.Schema({
  manifold_id: { type: mongoose.Schema.Types.ObjectId, ref: "Manifold" },
  inspection_id: { type: mongoose.Schema.Types.ObjectId, ref: "Inspection" },
  ID: { type: Number }, // create enum mb3d
  status: { type: String }, // create enum mb3d
  next_inspection: { type: Date },
  observation: { type: String },
});

const OuvrageStatus = mongoose.model("OuvrageStatus", ouvrageStatusSchema);

module.exports = OuvrageStatus;
