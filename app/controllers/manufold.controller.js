const Manufold = require("../models/manufold");
const Infrastracture = require("../models/infrastracture"); // Import the Infrastracture model
const Coord = require("../models/coord"); // Import the Coord model
const Address = require("../models/address"); // Import the Address model
const mongoose = require("mongoose");
const fs = require("fs");
const formidable = require("formidable");
const multer = require("multer");
const path = require("path");

const createManufold = async (req, res) => {
  try {
    console.log("raniaaaaaaaaaa");

    const uploadedFile = req.files.file[0];
    const uploadedFilePlan = req.files.planFile[0];

    console.log("uploaded fileeeeeeeeeeeee", uploadedFile);
    // Access other form fields through req.body
    const {
      latitude,
      longitude,
      name,
      centre,
      region,
      wilaya,
      zone,
      elevation,
      date,
      attributes,
      n_elements,
      n_transverselle,
      n_depart,
      niance,
    } = req.body;

    console.log(
      "uuuuuuuuu",
      name,
      attributes,
      centre,
      region,
      zone,
      wilaya,
      longitude,
      latitude,
      elevation,
      date
    );

    let filePath = "";
    if (uploadedFile) {
      filePath = uploadedFile.path;
    } else {
      console.log("No file provided");
    }
    let filePathFile = "";
    if (uploadedFile) {
      filePathFile = uploadedFilePlan.path;
    } else {
      console.log("No file provided");
    }

    console.log("hadjeeeeeeeeeeer", filePath); // Create a new Address document
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

    // Create a new manufold document
    const newManufold = new Manufold({
      ID: savedInfrastracture._id,
      name,
      date,
      file: filePath,
      filePlan: filePathFile,
      n_elements: n_elements,
      n_transverselle: n_transverselle,
      n_depart: n_depart,
      niance: niance, // Include the file path in the new Manufold document
    });

    // Add dynamic attributes to the manufold document
    // attributes.forEach(({ name, value }) => {
    //   newManufold.attributes.push({ name, value });
    // });

    // Save the new manufold document to the database
    const savedManufold = await newManufold.save();

    res
      .status(201)
      .json({ message: "You created user successfully", savedManufold });
  } catch (error) {
    console.error("Error creating manufold:", error);
    res.status(500).json({ error: "Failed to create manufold" });
  }
};

// Create a route for handling the file upload

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
      ID: manifold.ID._id,
      name: manifold.name,
      attributes: manifold.attributes,
      address: {
        _id: manifold.ID.coord_id.idAdr._id,
        centre: manifold.ID.coord_id.idAdr.centre,
        region: manifold.ID.coord_id.idAdr.region,
        zone: manifold.ID.coord_id.idAdr.zone,
        wilaya: manifold.ID.coord_id.idAdr.wilaya,
      },
      coords: {
        longitude: manifold.ID.coord_id.longitude,
        latitude: manifold.ID.coord_id.latitude,
      },
      elevation: manifold.ID.coord_id.elevation,
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
  console.log("llllllllllovennn");
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
    });
    console.log("debbbbbbbbut");
    if (!manufold) {
      return res.status(404).json({ error: "manufold not found" });
    }
    // const dateISOString = date.toISOString();
    // const [desiredDateFormat] = dateISOString.split('T');

    console.log("raniaaaaaaaaaaaaaaaaaaaaa");
    const dateISOString = manufold.date.toISOString();
    const [desiredDateFormat] = dateISOString.split("T");
    const transformedManifold = {
      _id: manufold._id,
      ID: manufold.ID._id,
      name: manufold.name,
      date: manufold.date,
      attributes: manufold.attributes,
      address: {
        _id: manufold.ID.coord_id.idAdr._id,
        centre: manufold.ID.coord_id.idAdr.centre,
        region: manufold.ID.coord_id.idAdr.region,
        zone: manufold.ID.coord_id.idAdr.zone,
        wilaya: manufold.ID.coord_id.idAdr.wilaya,
      },
      coords: {
        longitude: manufold.ID.coord_id.longitude,
        latitude: manufold.ID.coord_id.latitude,
      },
      elevation: manufold.ID.coord_id.elevation,
      formattedDate: desiredDateFormat,
      // formattedDate:desiredDateFormat
    };
    console.log(transformedManifold);
    res.status(200).json(transformedManifold);
  } catch (error) {
    console.error("Error fetching manufold:", error);
    res.status(500).json({ error: "Failed to fetch manufold" });
  }
};
/////////
const updateManufoldById = async (req, res) => {
  const { id } = req.params;
  const { name, attributes } = req.body;
  try {
    // Check if the provided ID is a valid ObjectId string
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Manufold ID" });
    }

    // Find the Manufold document by ID
    const manufold = await Manufold.findById(id);
    if (!manufold) {
      return res.status(404).json({ error: "Manufold not found" });
    }

    // Update Manufold properties if provided
    if (name) manufold.name = name;
    // Update dynamic attributes if provided
    if (attributes && Array.isArray(attributes) && attributes.length > 0) {
      attributes.forEach(({ name, value }) => {
        const existingAttribute = manufold.attributes.find(
          (attr) => attr.name === name
        );
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
    console.error("Error updating Manufold:", error);
    res.status(500).json({ error: "Failed to update Manufold" });
  }
};

module.exports = {
  createManufold,
  getAllManufolds,
  getManufoldById,
  updateManufoldById,
};
