const Manufold = require('../models/manufold'); // Import the manufold model
const Infrastracture = require('../models/infrastracture'); // Import the Infrastracture model
const Coord = require('../models/coord'); // Import the Coord model
const Address = require('../models/address'); // Import the Address model
const mongoose = require('mongoose');
// Controller function to handle creating a new manufold, Infrastracture, Coord, and Address
const createManufold = async (req, res) => {
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

    // Create a new manufold document with the reference to the Infrastracture document
    // const newmanufold = new manufold({
    //   Infrastracture: savedInfrastracture._id,
    //   order_date,
    //   gor,
    //   oil,
    //   gas
    // });
    if (!name || !attributes || !Array.isArray(attributes) || attributes.length === 0) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Create a new manufold document
    const newManufold = new Manufold({
      Infrastracture: savedInfrastracture._id,
      name });

    // Add dynamic attributes to the manufold document
    attributes.forEach(({ name, value }) => {
      newManufold.attributes.push({ name, value });
    });
    // Save the new manufold document to the database
    const savedManufold = await newManufold.save();

    res.status(201).json(savedManufold);
  } catch (error) {
    console.error('Error creating manufold:', error);
    res.status(500).json({ error: 'Failed to create manufold' });
  }
};
////
const getAllManufolds = async (req, res) => {
  try {
    const manufolds = await Manufold.find();
    res.status(200).json(manufolds);
  } catch (error) {
    console.error('Error fetching manufolds:', error);
    res.status(500).json({ error: 'Failed to fetch manufolds' });
  }
};
////////
const getManufoldById = async (req, res) => {
  const { id } = req.params;
  try {
    const manufold = await Manufold.findById(id);
    if (!manufold) {
      return res.status(404).json({ error: 'manufold not found' });
    }
    res.status(200).json(manufold);
  } catch (error) {
    console.error('Error fetching manufold:', error);
    res.status(500).json({ error: 'Failed to fetch manufold' });
  }
};
/////////
const updateManufoldById = async (req, res) => {
  const { id } = req.params;
  const { name, attributes } = req.body;
  try {
    // Check if the provided ID is a valid ObjectId string
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Manufold ID' });
    }

    // Find the Manufold document by ID
    const manufold = await Manufold.findById(id);
    if (!manufold) {
      return res.status(404).json({ error: 'Manufold not found' });
    }

    // Update Manufold properties if provided
    if (name) manufold.name = name;
    // Update dynamic attributes if provided
    if (attributes && Array.isArray(attributes) && attributes.length > 0) {
      attributes.forEach(({ name, value }) => {
        const existingAttribute = manufold.attributes.find(attr => attr.name === name);
        if (existingAttribute) {
          existingAttribute.value = value;
        } else {
          manufold.attributes.push({ name, value });
        }
      });
    }
    // Save the updated Manufold document
    const updatedManufold = await manufold.save();

    res.status(200).json(updatedManufold);
  } catch (error) {
    console.error('Error updating Manufold:', error);
    res.status(500).json({ error: 'Failed to update Manufold' });
  }
};

module.exports = {
  createManufold, getAllManufolds, getManufoldById, updateManufoldById
};