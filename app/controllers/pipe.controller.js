const mongoose = require('mongoose'); // Import mongoose module
const Pipe = require('../models/pipe'); // Import the Pipe model
const Coord = require('../models/coord');
const PipeSegment = require('../models/pipeSegment'); // Adjust the path as per your project structure
const Infrastracture = require('../models/infrastracture'); // Import the Infrastracture model

// Controller function to handle creating a new Pipe
// const createPipe = async (req, res) => {
//   try {
//     // Extract data from the request body
//     const { from_id, to_id, coord_ids, length, connectionType, type, nature } = req.body;
//     // Check if the provided from_id and to_id are valid ObjectId strings
//     if (!mongoose.Types.ObjectId.isValid(from_id) || !mongoose.Types.ObjectId.isValid(to_id)) {
//       return res.status(400).json({ error: 'Invalid ObjectId provided' });
//     }

//     // Check if the Infrastracture documents with the provided IDs exist
//     const fromInfrastracture = await Infrastracture.findById(from_id);
//     const toInfrastracture = await Infrastracture.findById(to_id);
//     if (!fromInfrastracture || !toInfrastracture) {
//       return res.status(404).json({ error: 'Infrastracture document not found' });
//     }
//     // Create a new Pipe document
//     const newPipe = new Pipe({
//       from_id: fromInfrastracture._id,
//       to_id: toInfrastracture._id,
//       length,
//       connectionType,
//       type,
//       nature
//     });
//     coord_ids.forEach(({ coord_id }) => {
//       newPipe.coord_ids.push({ coord_id });
//     });

//     // Save the new Pipe document to the database
//     const savedPipe = await newPipe.save();

//     res.status(201).json(savedPipe);
//   } catch (error) {
//     console.error('Error creating Pipe:', error);
//     res.status(500).json({ error: 'Failed to create Pipe' });
//   }
// };

// Controller function to handle creating a new Pipe
const createPipe = async (req, res) => {
  try {
    // Extract data from the request body
    const { from_id, to_id, coords, length, connectionType, type, nature, segments } = req.body;
      if (!mongoose.Types.ObjectId.isValid(from_id) || !mongoose.Types.ObjectId.isValid(to_id)) {
      return res.status(400).json({ error: 'Invalid ObjectId provided' });
    }

        // Check if the Infrastracture documents with the provided IDs exist
    const fromInfrastracture = await Infrastracture.findById(from_id);
    const toInfrastracture = await Infrastracture.findById(to_id);
    if (!fromInfrastracture || !toInfrastracture) {
      return res.status(404).json({ error: 'Infrastracture document not found' });
    }
    // Function to create or find existing coordinates
    const createOrFindCoord = async (coordData) => {
      const { longitude, latitude } = coordData;
      const existingCoord = await Coord.findOne({ longitude, latitude });
      if (existingCoord) {
        return existingCoord._id;
      }
      // Check if a Coord document with the same coordinates exists
        const newCoord = new Coord({
          longitude,
          latitude
          // Assign the Address ID to the Coord
        });

    const  coord = await newCoord.save(); // Save the new Coord
      

      return coord._id; // Return the Coord ID
    };

    // Create or find the From and To Coords

    // Create or find the Coords in the coords array
    const coord_ids = await Promise.all(coords.map(createOrFindCoord));

    // Create a new Pipe document
    const newPipe = new Pipe({
      from_id: fromInfrastracture._id,
      to_id: toInfrastracture._id,
      coord_ids,
      length,
      connectionType,
      type,
      nature
    });

    // Save the new Pipe document to the database
    const savedPipe = await newPipe.save();
// Create segments for the pipe
const createSegments = async () => {
  const createdSegments = [];
  for (const segmentData of segments) {
    const { coords, attributes } = segmentData;
    const coordIds = await Promise.all(coords.map(createOrFindCoord));

    // Create a new segment document
    const newSegment = new PipeSegment({
      pipeId: savedPipe._id,
      coor_id: coordIds,
      attributes
    });

    // Save the new segment document to the database
    const savedSegment = await newSegment.save();
    createdSegments.push(savedSegment);
  }
  return createdSegments;
};



const createdSegments = await createSegments();

res.status(201).json({ pipe: savedPipe, segments: createdSegments });
} catch (error) {
console.error('Error creating Pipe:', error);
res.status(500).json({ error: 'Failed to create Pipe and Segments' });
}
};



// Controller function to get all Pipes
const getAllPipes = async (req, res) => {
    try {
      const pipes = await Pipe.find();
      res.status(200).json(pipes);
    } catch (error) {
      console.error('Error getting Pipes:', error);
      res.status(500).json({ error: 'Failed to get Pipes' });
    }
  };
  
  // Controller function to get a specific Pipe by ID
  const getPipeById = async (req, res) => {
    const { id } = req.params;
    try {
      const pipe = await Pipe.findById(id);
      if (!pipe) {
        return res.status(404).json({ error: 'Pipe not found' });
      }
      res.status(200).json(pipe);
    } catch (error) {
      console.error('Error getting Pipe by ID:', error);
      res.status(500).json({ error: 'Failed to get Pipe' });
    }
  };
  
  // Controller function to update a Pipe by ID
  const updatePipeById = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
      const updatedPipe = await Pipe.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedPipe) {
        return res.status(404).json({ error: 'Pipe not found' });
      }
      res.status(200).json(updatedPipe);
    } catch (error) {
      console.error('Error updating Pipe by ID:', error);
      res.status(500).json({ error: 'Failed to update Pipe' });
    }
  };
  
  // Controller function to delete a Pipe by ID
  const deletePipeById = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedPipe = await Pipe.findByIdAndDelete(id);
      if (!deletedPipe) {
        return res.status(404).json({ error: 'Pipe not found' });
      }
      res.status(200).json({ message: 'Pipe deleted successfully' });
    } catch (error) {
      console.error('Error deleting Pipe by ID:', error);
      res.status(500).json({ error: 'Failed to delete Pipe' });
    }
  };
  
  module.exports = {
    createPipe,
    getAllPipes,
    getPipeById,
    updatePipeById,
    deletePipeById
  };