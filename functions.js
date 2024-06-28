const Counter = require("./app/models/Counter");

async function getNextId(docType) {
  const ranges = {
    'ep_note': { min: 1001, max: 2000 },
    'inspection_report': { min: 1, max: 1000 },
    'evaluation': { min: 3001, max: 4000 },
    'construction': { min: 4001, max: 5000 }

    // Add other document types and their ranges here
  };

  if (!ranges[docType]) {
    throw new Error(`Invalid document type: ${docType}`);
  }

  const counter = await Counter.findByIdAndUpdate(
    { _id: docType },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  
  const { min, max } = ranges[docType];
  return ((counter.seq - 1) % (max - min + 1)) + min;
}

module.exports = { getNextId };
