const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
});

const manufoldSchema = new mongoose.Schema({
  ID: { type: mongoose.Schema.Types.ObjectId, ref: "Infrastracture" },
  name: { type: String, required: true },
  attributes: [attributeSchema],
  date: { type: Date, required: true },
  file: { type: String, required: true },
  filePlan: { type: String, required: true },
  n_elements: { type: Number, required: true },
  n_transverselle: { type: Number, required: true },
  n_depart: { type: Number, required: true },
  niance: { type: String, required: true },
});

const Manufold = mongoose.model("Manufold", manufoldSchema);

module.exports = Manufold;
