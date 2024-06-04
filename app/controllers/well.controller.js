const Well = require("../models/well"); // Import the Well model
const Infrastracture = require("../models/infrastracture"); // Import the Infrastracture model
const Coord = require("../models/coord"); // Import the Coord model
const Address = require("../models/address"); // Import the Address model
const WellType = require("../models/wellType");
const mongoose = require("mongoose");

const authenticateToken = require("../middlewares/auth");
///////////
const fs = require("fs");
const csv = require("csv-parser");
const { populate } = require("../models/user.model");
// Controller function to handle creating new Well and related documents from CSV
const addWellsFromCSV = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      throw new Error("CSV file not uploaded or invalid file path.");
    }
    console.log('this is the ',req)
    const filePath = req.file.path;
    const wells = [];

    // Read and parse the CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const attributes = Object.keys(row)
          .filter(
            (key) =>
              ![
                "name",
                "centre",
                "region",
                "zone",
                "wilaya",
                "longitude",
                "latitude",
                "elevation",
                "type",
                "order_date",
              ].includes(key)
          )
          .map((key) => ({
            name: key,
            value: row[key],
          }));

        const wellData = {
          name: row.name,
          attributes,
          centre: row.centre,
          region: row.region,
          zone: row.zone,
          wilaya: row.wilaya,
          longitude: row.longitude,
          latitude: row.latitude,
          elevation: row.elevation,
          type: row.type,
          order_date: row.order_date,
        };

        wells.push(wellData);
      })
      .on("end", async () => {
        try {
          const savedWells = [];
          for (const wellData of wells) {
            const {
              name,
              attributes,
              centre,
              region,
              zone,
              wilaya,
              longitude,
              latitude,
              elevation,
              type,
              order_date,
            } = wellData;

            const newAddress = new Address({ centre, region, zone, wilaya });
            const savedAddress = await newAddress.save();

            const newCoord = new Coord({
              longitude,
              latitude,
              elevation,
              idAdr: savedAddress._id,
            });
            const savedCoord = await newCoord.save();

            const newInfrastracture = new Infrastracture({
              coord_id: savedCoord._id,
            });
            const savedInfrastracture = await newInfrastracture.save();

            const newWell = new Well({
              Infrastracture: savedInfrastracture._id,
              name,
              attributes,
              order_date: new Date(order_date),
            });

            const savedWell = await newWell.save();

            if (type) {
              const newWellType = new WellType({
                well_id: savedWell._id,
                type,
                date: new Date(order_date),
              });
              await newWellType.save();
            }

            savedWells.push(savedWell);
          }

          console.log("Successfully added wells:", savedWells);
          res
            .status(201)
            .json({ message: "Wells added successfully", wells: savedWells });
        } catch (error) {
          console.error("Error adding wells:", error);
          res.status(500).json({ error: "Failed to add wells" });
        }
      });
  } catch (error) {
    console.error("Error processing CSV file:", error);
    res.status(500).json({ error: "Failed to process CSV file" });
  }
};

// Controller function to handle creating a new Well, Infrastracture, Coord, and Address
const createWell = async (req, res) => {
  try {
    console.log("boooooooooooooooooody", req.body);
    // Extract data from  the request body
    const {
      name,
      attributes,
      centre,
      region,
      zone,
      wilaya,
      longitude,
      latitude,
      type,
      elevation,
      date,
    } = req.body;
    // Create a new Address document
    const newAddress = new Address({
      centre,
      region,
      zone,
      wilaya,
    });
    // Save the new Address document to the database
    const savedAddress = await newAddress.save();

    // Create a new Coord document
    const newCoord = new Coord({
      longitude,
      latitude,
      elevation,
      idAdr: savedAddress._id,
    });

    // Save the new Coord document to the database
    const savedCoord = await newCoord.save();
    // Create a new Infrastracture document
    const newInfrastracture = new Infrastracture({
      coord_id: savedCoord._id,
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
    // console.log(req);
    if (!name || !attributes || !Array.isArray(attributes) || attributes.length === 0) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Create a new Well document
    const newWell = new Well({
      ID: savedInfrastracture._id,
      name,
    });

    // Add dynamic attributes to the Well document
    attributes.forEach(({ name, value }) => {
      newWell.attributes.push({ name, value });
    });
    // Save the new Well document to the database
    const savedWell = await newWell.save();
    ///
    createWellType(type, date, savedWell);

    res.status(201).json(savedWell);
  } catch (error) {
    console.error("Error creating Well:", error);
    res.status(500).json({ error: "Failed to create Well" });
  }
};
////
const getAllWells = async (req, res) => {
  try {
    console.log("staaaaaaaaaaart");
    const wells = await Well.find().populate({
      path: "ID",
      populate: {
        path: "coord_id",
        model: "Coord",
        populate: {
          path: "idAdr",
        },
      },
    });
    if (!wells) {
      return res.status(404).json({ error: 'wells not found' });
    }
    const transformedWells = wells.map((well) => ({
      _id: well._id,
      ID: well.ID._id,
      name: well.name,
      attributes: well.attributes,
      address: {
        _id: well.ID.coord_id.idAdr._id,
        centre: well.ID.coord_id.idAdr.centre,
        region: well.ID.coord_id.idAdr.region,
        zone: well.ID.coord_id.idAdr.zone,
        wilaya: well.ID.coord_id.idAdr.wilaya,
      },
      coords: {
        longitude: well.ID.coord_id.longitude,
        latitude: well.ID.coord_id.latitude,
      },
      elevation: well.ID.coord_id.elevation,
    }));

    res.status(200).json(transformedWells);
    console.log("eeeednd");
  } catch (error) {
    console.error("Error fetching Wells:", error);
    res.status(500).json({ error: "Failed to fetch Wells" });
  }
};
////////
const getWellById = async (req, res) => {
  const { id } = req.params;
  try {
    const wellItem = await Well.findById(id).populate({
      path: "ID",
      populate: {
        path: "coord_id",
        model: "Coord",
        populate: {
          path: "idAdr",
        },
      },
    })

    if (!wellItem) {
      return res.status(404).json({ error: "Well not found" });
    }
    const wellType = await WellType.findOne({ well_id: id });
    const {date}=wellType
    console.log('daaaaaaaaaaaate',date)
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
    console.error("Error fetching Well:", error);
    res.status(500).json({ error: "Failed to fetch Well" });
  }
};
//////////////
const createWellType = async (type, date, savedWell) => {
  if (type) {
    const newWellType = new WellType({
      well_id: savedWell._id,
      type,
      date: new Date(date),
    });
    return await newWellType.save();
  }
};
/////////
const updateWellById = async (req, res) => {
  const { id } = req.params;
  const { name, attributes } = req.body;
  try {
    // Check if the provided ID is a valid ObjectId string
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Well ID" });
    }

    // Find the Well document by ID
    const well = await Well.findById(id);
    if (!well) {
      return res.status(404).json({ error: "Well not found" });
    }

    // Update Well properties if provided
    if (name) well.name = name;
    // Update dynamic attributes if provided
    if (attributes && Array.isArray(attributes) && attributes.length > 0) {
      attributes.forEach(({ name, value }) => {
        const existingAttribute = well.attributes.find(
          (attr) => attr.name === name
        );
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
    console.error("Error updating Well:", error);
    res.status(500).json({ error: "Failed to update Well" });
  }
};

module.exports = {
  createWell,
  getAllWells,
  getWellById,
  updateWellById,
  createWellType,
  addWellsFromCSV,
};
