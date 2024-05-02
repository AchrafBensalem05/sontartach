const Well = require('../models/well'); // Import the Well model
const Infrastracture = require('../models/infrastracture'); // Import the Infrastracture model
const Coord = require('../models/coord'); // Import the Coord model
const Address = require('../models/address'); // Import the Address model

// Controller function to handle creating a new Well, Infrastracture, Coord, and Address
const createWell = async (req, res) => {
  try {
    // Extract data from the request body
    const { centre, region, zone, wilaya, longitude, latitude, elevation, order_date, gor, oil, gas } = req.body;
console.log(centre,region,zone,wilaya);
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
    const newWell = new Well({
      Infrastracture: savedInfrastracture._id,
      order_date,
      gor,
      oil,
      gas
    });

    // Save the new Well document to the database
    const savedWell = await newWell.save();

    res.status(201).json(savedWell);
  } catch (error) {
    console.error('Error creating Well:', error);
    res.status(500).json({ error: 'Failed to create Well' });
  }
};

module.exports = {
  createWell
};
