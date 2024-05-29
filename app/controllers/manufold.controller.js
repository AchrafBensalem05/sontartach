const Manufold = require('../models/manufold'); // Import the manufold model
const Infrastracture = require('../models/infrastracture'); // Import the Infrastracture model
const Coord = require('../models/coord'); // Import the Coord model
const Address = require('../models/address'); // Import the Address model
const mongoose = require('mongoose');
// Controller function to handle creating a new manufold, Infrastracture, Coord, and Address
const createManufold = async (req, res) => {
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

    // Create a new manufold document with the reference to the Infrastracture document
    // const newmanufold = new manufold({
    //   Infrastracture: savedInfrastracture._id,
    //   order_date,
    //   gor,
    //   oil,
    //   gas
    // });
    // if (!name || !attributes || !Array.isArray(attributes) || attributes.length === 0) {
    //   return res.status(400).json({ error: 'Invalid request body' });
    // }
    console.log('xxxxxx')

    // Create a new manufold document
    const newManufold = new Manufold({
      ID: savedInfrastracture._id,
      name });
      console.log('qqqqqqq')

    // Add dynamic attributes to the manufold document
    attributes.forEach(({ name, value }) => {
      newManufold.attributes.push({ name, value });
    });
    // Save the new manufold document to the database
    const savedManufold = await newManufold.save();

    res.status(201).json({message: "you ccreated user successfully",savedManufold});
    console.log('doooooooooo')

  } catch (error) {
    console.error('Error creating manufold:', error);
    res.status(500).json({ error: 'Failed to create manufold' });
  }
};
////
const getAllManufolds = async (req, res) => {
  try {
    console.log("staaaaaaaaaaart");
    const manifolds = await Manufold.find().populate({
      path: "ID",
      populate: {
        path: "coord_id",
        model: "Coord",
        populate: {
          path: "idAdr",
        },
      },
    });

    const transformedManifolds = manifolds.map((manifold) => ({
      _id: manifold._id,
      ID:manifold.ID._id,
      name:manifold.name,
      attributes:manifold.attributes,
      address: {
        _id:manifold.ID.coord_id.idAdr._id,
        centre:manifold.ID.coord_id.idAdr.centre,
        region:manifold.ID.coord_id.idAdr.region,
        zone:manifold.ID.coord_id.idAdr.zone,
        wilaya:manifold.ID.coord_id.idAdr.wilaya,
      },
      coords: {
        longitude:manifold.ID.coord_id.longitude,
        latitude:manifold.ID.coord_id.latitude,
      },
      elevation:manifold.ID.coord_id.elevation,
    }));

    res.status(200).json(transformedManifolds);
    console.log("eeeednd");
  } catch (error) {
    console.error("Error fetching Wells:", error);
    res.status(500).json({ error: "Failed to fetch Wells" });
  }
};
////////
const getManufoldById = async (req, res) => {
  const { id } = req.params;
  try {
    const manufold = await Manufold.findById(id).populate({
      path: "ID",
      populate: {
        path: "coord_id",
        model: "Coord",
        populate: {
          path: "idAdr",
        },
      },
    })

    if (!manufold) {
      return res.status(404).json({ error: "manufold not found" });
    }
    const dateISOString = date.toISOString();
    const [desiredDateFormat] = dateISOString.split('T');
    const transformedWells ={
      _id: wellItem._id,
      ID: wellItem.ID._id,
      name: wellItem.name,
      attributes: wellItem.attributes,
      address: {
        _id: wellItem.ID.coord_id.idAdr._id,
        centre: wellItem.ID.coord_id.idAdr.centre,
        region: wellItem.ID.coord_id.idAdr.region,
        zone: wellItem.ID.coord_id.idAdr.zone,
        wilaya: wellItem.ID.coord_id.idAdr.wilaya,
      },
      coords: {
        longitude: wellItem.ID.coord_id.longitude,
        latitude: wellItem.ID.coord_id.latitude,
      },
      elevation: wellItem.ID.coord_id.elevation,
      wellType: wellType.toObject(),
      formattedDate:desiredDateFormat
    };
    console.log(transformedWells)
    res.status(200).json(transformedWells);
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
