const Inspection = require('../models/inspection');

// Controller to create a new inspection
const createInspection = async (req, res) => {
  try {
    const { pipeID, Inspection_date, observation, ficher } = req.body;
    const newInspection = new Inspection({ pipeID, Inspection_date, observation, ficher });
    const savedInspection = await newInspection.save();
    res.status(201).json({ inspection: savedInspection });
  } catch (error) {
    console.error('Error creating Inspection:', error);
    res.status(500).json({ error: 'Failed to create Inspection' });
  }
};

// Controller to get all inspections
const getAllInspections = async (req, res) => {
  try {
    const inspections = await Inspection.find();
    res.status(200).json({ inspections });
  } catch (error) {
    console.error('Error fetching Inspections:', error);
    res.status(500).json({ error: 'Failed to fetch Inspections' });
  }
};

// Other controller methods such as updateInspection, deleteInspection, etc. can be added similarly

module.exports = {createInspection, getAllInspections};
