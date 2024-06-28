const mongoose = require("mongoose"); // Import mongoose module
const Pipe = require("../models/pipe"); // Import the Pipe model
const Coord = require("../models/coord");
const PipeSegment = require("../models/pipeSegment"); // Adjust the path as per your project structure
const Infrastracture = require("../models/infrastracture"); // Import the Infrastracture model
const PipeStatus = require("../models/pipeStatus");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const express = require("express");
const { ConnectionPoolClosedEvent } = require("mongodb");
const { log } = require("console");
const Well = require("../models/well");
const Manufold = require("../models/manufold");
const Junction = require("../models/junction");

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
    const { result, segments,elevations } = req.body;
    console.log("kkkkkk", result);

    // Extract data from the request body
    const {
      from_id,
      to_id,
      connectionType,
      type,
      date,
      nature,
      newTotalDistance,
      coords,
    } = result;
    console.log("oiiiiiiiiiiiiiii", segments);
    // for (const segmentData of segments) {
    //   console.log('segmeeeeeeeeeeeeeeeent',segmentData)
    //   const { coords, attributes } = segmentData;
    //   console.log('cooooooooooooooooooooords',coords)

    // }
    //   if (!mongoose.Types.ObjectId.isValid(from_id) || !mongoose.Types.ObjectId.isValid(to_id)) {
    //   return res.status(400).json({ error: 'Invalid ObjectId provided' });
    // }

    const fromInfrastracture = await Infrastracture.findById(from_id);
    const toInfrastracture = await Infrastracture.findById(to_id);
    if (!fromInfrastracture || !toInfrastracture) {
      return res
        .status(404)
        .json({ error: "Infrastracture document not found" });
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
        latitude,
        // Assign the Address ID to the Coord
      });

      const coord = await newCoord.save(); // Save the new Coord

      return coord._id; // Return the Coord ID
    };

    // Create or find the From and To Coords

    // Create or find the Coords in the coords array
    const coord_ids = await Promise.all(coords.map(createOrFindCoord));

    // Create a new Pipe document
    const newPipe = new Pipe({
      from_id: fromInfrastracture._id,
      to_id: toInfrastracture._id,
      coord_ids: coord_ids,
      length: newTotalDistance,
      connectionType,
      type: "collect",
      nature: "oil",
      elevations:elevations
    });

    // Save the new Pipe document to the database
    const savedPipe = await newPipe.save();
    // Create segments for the pipeµ
    console.log("raaaaaaaaaaaaaaaaaaaaan");
    const createSegments = async () => {
      const createdSegments = [];
      for (const segmentData of segments) {
        console.log("segmeeeeeeeeeeeeeeeent222222222211111111111", segmentData);
        const { coords, attributes } = segmentData;
        const coordIds = await Promise.all(coords.map(createOrFindCoord));

        // Create a new segment document
        const newSegment = new PipeSegment({
          pipeId: savedPipe._id,
          coor_id: coordIds,
          attributes,
        });

        // Save the new segment document to the database
        const savedSegment = await newSegment.save();
        createdSegments.push(savedSegment);
      }
      return createdSegments;
    };
    // createPipeStatus(type,date,savedPipe);
    const createdSegments = await createSegments();

    res.status(201).json({ pipe: savedPipe, segments: createdSegments });
    console.log("wooooooorks");
  } catch (error) {
    console.error("Error creating Pipe:", error);
    res.status(500).json({ error: "Failed to create Pipe and Segments" });
  }
};

// Controller function to get all Pipes
const getAllPipes = async (req, res) => {
  try {
    const pipes = await Pipe.find()
      .populate({
        path: "from_id",
        model: "Infrastracture",
      })
      .populate({
        path: "to_id",
        model: "Infrastracture",
      })
      .populate({
        path: "coord_ids",
        model: "Coord",
        populate: {
          path: "idAdr",
          model: "Address",
        },
      });

    const transformedPipes = pipes.map((pipe) => {
      const coords = pipe.coord_ids.map((coord) => [
        coord.latitude,
        coord.longitude,
      ]);
      return {
        _id: pipe._id,
        name: pipe.length,
        coords,
      };
    });
    res.status(200).json(transformedPipes);
  } catch (error) {
    console.error("Error getting Pipes:", error);
    res.status(500).json({ error: "Failed to get Pipes" });
  }
};

const createPipeStatus = async (status, date, savedPipe) => {
  if (status) {
    const newPipeStatus = new PipeStatus({
      pipe_id: savedPipe._id,
      status,
      date: new Date(date),
    });
    return await newPipeStatus.save();
  }
};

const createPipeStatusHistory = async (req, res) => {
  try {
    console.log(req.file, req.params);
    if (!req.file || !req.file.path) {
      throw new Error("CSV file not uploaded or invalid file path.");
    }

    const { pipeId } = req.params;
    log(req.params);
    if (!req.params) {
      throw new Error("Pipe ID not provided.");
    }

    const filePath = req.file.path;
    const statuses = [];

    // Read and parse the CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const statusData = {
          pipe_id: pipeId,
          status: row.status,
          date: new Date(row.status_date),
        };

        statuses.push(statusData);
      })
      .on("end", async () => {
        try {
          const savedStatuses = [];
          for (const statusData of statuses) {
            const newPipeStatus = new PipeStatus(statusData);
            const savedStatus = await newPipeStatus.save();
            savedStatuses.push(savedStatus);
          }

          console.log("Successfully added pipe statuses:", savedStatuses);
          res
            .status(201)
            .json({
              message: "Pipe statuses added successfully",
              statuses: savedStatuses,
            });
        } catch (error) {
          console.error("Error adding pipe statuses:", error);
          res.status(500).json({ error: "Failed to add pipe statuses" });
        }
      })
      .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        res.status(500).json({ error: "Failed to read CSV file" });
      });
  } catch (error) {
    console.error("Error processing CSV file:", error);
    res.status(500).json({ error: "Failed to process CSV file" });
  }
};

// Controller function to get a specific Pipe by ID
const getPipeById = async (req, res) => {
  const { id } = req.params;
  try {
    const pipe = await Pipe.findById(id)
      .populate({
        path: "from_id",
        model: "Infrastracture",
      })
      .populate({
        path: "to_id",
        model: "Infrastracture",
      })
      .populate({
        path: "coord_ids",
        model: "Coord",
        populate: {
          path: "idAdr",
          model: "Address",
        },
      });
    if (!pipe) {
      return res.status(404).json({ error: "Pipe not found" });
    }
    const to = pipe.to_id.ID;
    const from = pipe.from_id.ID;
    const fromDetails =
      (await Well.findOne({ from }).populate({
        path: "ID",
        model: "Infrastracture",
        populate: {
          path: "coord_id",
          model: "Coord",
        },
      })
      ) ||
       (await Manufold.findOne({ from }).populate({
        path: "ID",
        model: "Infrastracture",
        populate: {
          path: "coord_id",
          model: "Coord",
        },
      })
      );
    const toDetails =
      (await Manufold.findOne({ to }).populate({
        path: "ID",
        model: "Infrastracture",
        populate: {
          path: "coord_id",
          model: "Coord",
        },

      })
) || (await Junction.findOne({ to }).populate({
        path: "ID",
        model: "Infrastracture",
        populate: {
          path: "coord_id",
          model: "Coord",
        },
      })
     );
    console.log("toooooooooooooooooovvvvvvvvvvvvvvvvvvvvvvv", pipe);

    const coords = pipe.coord_ids.map((coord) => [
      coord.latitude,
      coord.longitude,
    ]);
    const pipedetails = {
      _id: pipe._id,
      length: pipe.length,
      connectionType: pipe.connectionType,
      type: pipe.type,
      nature: pipe.nature,
      fromDetails,
      toDetails,
      coords,
      elevations:pipe.elevations
    };

    console.log("piiiiiiiiiiiiiiiiipe", pipedetails);

    res.status(200).json(pipedetails);
  } catch (error) {
    console.error("Error getting Pipe by ID:", error);
    res.status(500).json({ error: "Failed to get Pipe" });
  }
};

// Controller function to update a Pipe by ID
const updatePipe = async (req, res) => {
  try {
    const pipeId = mongoose.Types.ObjectId(req.params);
    const { segments } = req.body;

    if (!mongoose.Types.ObjectId.isValid(pipeId)) {
      return res.status(400).json({ error: "Invalid Pipe ID provided" });
    }

    const existingPipe = await Pipe.findById(pipeId);
    if (!existingPipe) {
      return res.status(404).json({ error: "Pipe not found" });
    }
    const createOrFindCoord = async (coordData) => {
      const { longitude, latitude } = coordData;
      const existingCoord = await Coord.findOne({ longitude, latitude });
      if (existingCoord) {
        return existingCoord._id;
      }
      // Check if a Coord document with the same coordinates exists
      const newCoord = new Coord({
        longitude,
        latitude,
        // Assign the Address ID to the Coord
      });

      const coord = await newCoord.save(); // Save the new Coord

      return coord._id; // Return the Coord ID
    };

    // Update or create new PipeSegments
    const createOrUpdateSegments = async () => {
      const updatedSegments = [];
      for (const segmentData of segments) {
        const { coords, attributes } = segmentData;
        const coordIds = await Promise.all(coords.map(createOrFindCoord));

        // Check if the segment exists for the pipe
        const existingSegment = await PipeSegment.findOne({
          pipeId: existingPipe._id,
        });
        if (existingSegment) {
          // Update existing segment
          existingSegment.coor_id = coordIds;
          // Update other fields as needed
          const updatedSegment = await existingSegment.save();
          updatedSegments.push(updatedSegment);
        } else {
          // Create new segment
          const newSegment = new PipeSegment({
            pipeId: existingPipe._id,
            coor_id: coordIds,
            attributes,
          });
          const savedSegment = await newSegment.save();
          updatedSegments.push(savedSegment);
        }
      }
      return updatedSegments;
    };

    const updatedSegments = await createOrUpdateSegments();
    
    res.status(200).json({ pipe: existingPipe, segments: updatedSegments });
  } catch (error) {
    console.error("Error updating Pipe:", error);
    res.status(500).json({ error: "Failed to update Pipe and Segments" });
  }
};

// Controller function to get all segments by Pipe ID
const getSegmentsByPipeId = async (req, res) => {
  const pipeId = mongoose.Types.ObjectId(req.params);

  if (!mongoose.Types.ObjectId.isValid(pipeId)) {
    return res.status(400).json({ error: "Invalid Pipe ID provided" });
  }

  try {
    // Find the Pipe by ID to check if it exists
    const pipe = await Pipe.findById(pipeId);
    if (!pipe) {
      return res.status(404).json({ error: "Pipe not found" });
    }

    // Find all segments related to the Pipe ID
    const segments = await PipeSegment.find({ pipeId }).populate({
      path: "coor_id",
      model: "Coord",
    });
    console.log("wiaaaaaaaam", segments);

    res.status(200).json(segments);
  } catch (error) {
    console.error("Error retrieving segments by Pipe ID:", error);
    res.status(500).json({ error: "Failed to retrieve segments" });
  }
};
// Controller function to delete a Pipe by ID
const deletePipeById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPipe = await Pipe.findByIdAndDelete(id);
    if (!deletedPipe) {
      return res.status(404).json({ error: "Pipe not found" });
    }
    res.status(200).json({ message: "Pipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting Pipe by ID:", error);
    res.status(500).json({ error: "Failed to delete Pipe" });
  }
};

const upload = multer({ dest: "uploads/" }); // Define storage for multer

const createMultiplePipeStatuses = async (req, res) => {
  const { id } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "CSV file is required." });
  }

  const pipeStatuses = [];

  fs.createReadStream(file.path)
    .pipe(csv())
    .on("data", (row) => {
      const { status, status_date } = row;
      if (status && status_date) {
        pipeStatuses.push(
          new PipeStatus({
            pipe_id: id,
            status,
            date: new Date(status_date),
          })
        );
      }
    })
    .on("end", async () => {
      try {
        const savedStatuses = await PipeStatus.insertMany(pipeStatuses);
        return res.status(201).json(savedStatuses);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      } finally {
        fs.unlinkSync(file.path); // Clean up the uploaded file
      }
    });
};

module.exports = {
  createPipe,
  getAllPipes,
  getPipeById,
  updatePipe,
  deletePipeById,
  getSegmentsByPipeId,
  createPipeStatusHistory,
  createMultiplePipeStatuses,
};
