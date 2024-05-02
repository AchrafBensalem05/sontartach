const mongoose = require('mongoose'); // Import mongoose module
const Pipe = require('../models/pipe'); // Import the Pipe model

const Infrastracture = require('../models/infrastracture'); // Import the Infrastracture model

// Controller function to handle creating a new Pipe
const createPipe = async (req, res) => {
  try {
    // Extract data from the request body
    const { from_id, to_id, length, connectionType, type, nature } = req.body;
    // Check if the provided from_id and to_id are valid ObjectId strings
    if (!mongoose.Types.ObjectId.isValid(from_id) || !mongoose.Types.ObjectId.isValid(to_id)) {
      return res.status(400).json({ error: 'Invalid ObjectId provided' });
    }

    // Check if the Infrastracture documents with the provided IDs exist
    const fromInfrastracture = await Infrastracture.findById(from_id);
    const toInfrastracture = await Infrastracture.findById(to_id);
    if (!fromInfrastracture || !toInfrastracture) {
      return res.status(404).json({ error: 'Infrastracture document not found' });
    }

    // Create a new Pipe document
    const newPipe = new Pipe({
      from_id: fromInfrastracture._id,
      to_id: toInfrastracture._id,
      length,
      connectionType,
      type,
      nature
    });

    // Save the new Pipe document to the database
    const savedPipe = await newPipe.save();

    res.status(201).json(savedPipe);
  } catch (error) {
    console.error('Error creating Pipe:', error);
    res.status(500).json({ error: 'Failed to create Pipe' });
  }
};

module.exports = {
  createPipe
};
