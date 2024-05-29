const Junction = require('../models/junction'); // Import the junction model
const Infrastracture = require('../models/infrastracture'); // Import the Infrastracture model
const Coord = require('../models/coord'); // Import the Coord model
const Address = require('../models/address'); // Import the Address model
const mongoose = require('mongoose');
// Controller function to handle creating a new junction, Infrastracture, Coord, and Address
const createJunction = async (req, res) => {
  try {
    // Extract data from the request body
    console.log('zzzzzzzzzz')
    console.log('body',req.body)
    const { name, attributes, centre, region, zone, wilaya, longitude, latitude, elevation } = req.body;
    // Create a new Address document
    const newAddress = new Address({
      centre,
      region,
      zone,
      wilaya
    });
    console.log('ddddd')
    // Save the new Address document to the database
    const savedAddress = await newAddress.save();
    console.log('ccccc')
    // Create a new Coord document
    const newCoord = new Coord({
      longitude,
      latitude,
      elevation,
      idAdr: savedAddress._id
    });

    // Save the new Coord document to the database
    const savedCoord = await newCoord.save();
    console.log('eeeee')

    // Create a new Infrastracture document
    const newInfrastracture = new Infrastracture({
      coord_id: savedCoord._id
    });
    console.log('fffffff')

    // Save the new Infrastracture document to the database
    const savedInfrastracture = await newInfrastracture.save();

    console.log('xxxxxx')

    // Create a new junction document
    const newJunction = new Junction({
      ID: savedInfrastracture._id,
      name });
      console.log('qqqqqqq')

    // Add dynamic attributes to the junction document
    attributes.forEach(({ name, value }) => {
      newJunction.attributes.push({ name, value });
    });
    // Save the new junction document to the database
    const savedJunction = await newJunction.save();

    res.status(201).json({message: "you ccreated user successfully",savedJunction});
    console.log('doooooooooo')

  } catch (error) {
    console.error('Error creating junction:', error);
    res.status(500).json({ error: 'Failed to create junction' });
  }
};
////
const getAllJunctions = async (req, res) => {
  try {
    console.log("staaaaaaaaaaart");
    const junctions = await Junction.find().populate({
      path: "ID",
      populate: {
        path: "coord_id",
        model: "Coord",
        populate: {
          path: "idAdr",
        },
      },
    });

    const transformedJunctions = junctions.map((junction) => ({
      _id: junction._id,
      ID:junction.ID._id,
      name:junction.name,
      attributes:junction.attributes,
      address: {
        _id:junction.ID.coord_id.idAdr._id,
        centre:junction.ID.coord_id.idAdr.centre,
        region:junction.ID.coord_id.idAdr.region,
        zone:junction.ID.coord_id.idAdr.zone,
        wilaya:junction.ID.coord_id.idAdr.wilaya,
      },
      coords: {
        longitude:junction.ID.coord_id.longitude,
        latitude:junction.ID.coord_id.latitude,
      },
      elevation:junction.ID.coord_id.elevation,
    }));

    res.status(200).json(transformedJunctions);
    console.log("eeeednd");
  } catch (error) {
    console.error("Error fetching Wells:", error);
    res.status(500).json({ error: "Failed to fetch Wells" });
  }
};
////////
const getJunctionById = async (req, res) => {
  const { id } = req.params;
  try {
    const junction = await Junction.findById(id);
    if (!junction) {
      return res.status(404).json({ error: 'junction not found' });
    }
    res.status(200).json(junction);
  } catch (error) {
    console.error('Error fetching junction:', error);
    res.status(500).json({ error: 'Failed to fetch junction' });
  }
};
/////////
const updateJunctionById = async (req, res) => {
  const { id } = req.params;
  const { name, attributes } = req.body;
  try {
    // Check if the provided ID is a valid ObjectId string
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Junction ID' });
    }

    // Find the Junction document by ID
    const junction = await Junction.findById(id);
    if (!junction) {
      return res.status(404).json({ error: 'Junction not found' });
    }

    // Update Junction properties if provided
    if (name) junction.name = name;
    // Update dynamic attributes if provided
    if (attributes && Array.isArray(attributes) && attributes.length > 0) {
      attributes.forEach(({ name, value }) => {
        const existingAttribute = junction.attributes.find(attr => attr.name === name);
        if (existingAttribute) {
          existingAttribute.value = value;
        } else {
          junction.attributes.push({ name, value });
        }
      });
    }
    // Save the updated Junction document
    const updatedJunction = await junction.save();

    res.status(200).json(updatedJunction);
  } catch (error) {
    console.error('Error updating Junction:', error);
    res.status(500).json({ error: 'Failed to update Junction' });
  }
};

module.exports = {
  createJunction, getAllJunctions, getJunctionById, updateJunctionById
};
