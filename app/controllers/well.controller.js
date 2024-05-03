const Well = require('../models/well'); // Import the Well model
const Infrastracture = require('../models/infrastracture'); // Import the Infrastracture model
const Coord = require('../models/coord'); // Import the Coord model
const Address = require('../models/address'); // Import the Address model
const mongoose = require('mongoose');

// Controller function to handle creating a new Well, Infrastracture, Coord, and Address
const createWell = async (req, res) => {
  try {
    // Extract data from the request body
    const { name, attributes, centre, region, zone, wilaya, longitude, latitude, elevation } = req.body;
    // Create a new Address document
    const newAddress = new Address({
      centre,
      region,
      zone,
      wilaya
    });

    // Save the new Address document to the database
    const savedAddress = await newAddress.save();

    // Create a new Coord document
    const newCoord = new Coord({
      longitude,
      latitude,
      elevation,
      idAdr: savedAddress._id
    });

    // Save the new Coord document to the database
    const savedCoord = await newCoord.save();

    // Create a new Infrastracture document
    const newInfrastracture = new Infrastracture({
      coord_id: savedCoord._id
    });

    // Save the new Infrastracture document to the database
    const savedInfrastracture = await newInfrastracture.save();

    // Create a new Well document with the reference to the Infrastracture document
    // const newWell = new Well({
    //   Infrastracture: savedInfrastracture._id,
    //   order_date,
    //   gor,
    //   oil,
    //   gas
    // });
    if (!name || !attributes || !Array.isArray(attributes) || attributes.length === 0) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Create a new Well document
    const newWell = new Well({
      Infrastracture: savedInfrastracture._id,
      name });

    // Add dynamic attributes to the Well document
    attributes.forEach(({ name, value }) => {
      newWell.attributes.push({ name, value });
    });
    // Save the new Well document to the database
    const savedWell = await newWell.save();

    res.status(201).json(savedWell);
  } catch (error) {
    console.error('Error creating Well:', error);
    res.status(500).json({ error: 'Failed to create Well' });
  }
};
////
const getAllWells = async (req, res) => {
  try {
    const wells = await Well.find();
    res.status(200).json(wells);
  } catch (error) {
    console.error('Error fetching Wells:', error);
    res.status(500).json({ error: 'Failed to fetch Wells' });
  }
};
////////
const getWellById = async (req, res) => {
  const { id } = req.params;
  try {
    const well = await Well.findById(id);
    if (!well) {
      return res.status(404).json({ error: 'Well not found' });
    }
    res.status(200).json(well);
  } catch (error) {
    console.error('Error fetching Well:', error);
    res.status(500).json({ error: 'Failed to fetch Well' });
  }
};
/////////
const updateWellById = async (req, res) => {
  const { id } = req.params;
  const { name, attributes } = req.body;
  try {
    // Check if the provided ID is a valid ObjectId string
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Well ID' });
    }

    // Find the Well document by ID
    const well = await Well.findById(id);
    if (!well) {
      return res.status(404).json({ error: 'Well not found' });
    }

    // Update Well properties if provided
    if (name) well.name = name;
    // Update dynamic attributes if provided
    if (attributes && Array.isArray(attributes) && attributes.length > 0) {
      attributes.forEach(({ name, value }) => {
        const existingAttribute = well.attributes.find(attr => attr.name === name);
        if (existingAttribute) {
          existingAttribute.value = value;
        } else {
          well.attributes.push({ name, value });
        }
      });
    }
    // Save the updated Well document
    const updatedWell = await well.save();

    res.status(200).json(updatedWell);
  } catch (error) {
    console.error('Error updating Well:', error);
    res.status(500).json({ error: 'Failed to update Well' });
  }
};

module.exports = {
  createWell, getAllWells, getWellById, updateWellById
};
