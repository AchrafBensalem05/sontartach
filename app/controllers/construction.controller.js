const { getNextId } = require("../../functions");
const EpNote = require("../models/Epnote");
const Construction = require("../models/construction");
const Evaluation = require("../models/evaluation");
const Inspection = require("../models/inspection");
const InspectionDepReport = require("../models/inspectionDepReport");

// Controller to create a new inspection
const createContruction = async (req, res) => {
  try {
    const specialId = await getNextId('construction');
    const { message, InspectionID,user } = req.body;
    console.log("foooooooooooooooooo");
    const filePath =req.file ? req.file.path : '';
    console.log("pvvvvvvvvvvvvvvvv", filePath);
    const constructioninstance = new Construction({
      message: message,
      ficher: filePath ,
      date: new Date(),
      ID:specialId,
      user:user
    });
    console.log(InspectionID, "oppppppppp");
    const savedconstructioninstance = await constructioninstance.save();

    console.log("ttttttttttttttt", constructioninstance);
    const inspectionFound = await Inspection.findById(InspectionID);
    console.log("inspectionFound", inspectionFound);
    const updatedInspection = await Inspection.findByIdAndUpdate(InspectionID, {
        constructionID: savedconstructioninstance._id,
        status: 'finished'
    },
    
  );

    if (!updatedInspection) {
      return res.status(404).json({ error: "Inspection not found" });
    }

    console.log("Updated Inspection:", updatedInspection);
    res
      .status(201)
      .json({
        message: "Your construction report sent successfully",
        updatedInspection,
      });
  } catch (error) {
    console.error("Error creating Inspection:", error);
    res.status(500).json({ error: "Failed to create Inspection" });
  }
};

// Controller to get all inspections
const getConstruction = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('amaaaaaaaaaaaaaani',id)

    const construction = await Inspection.findById(id).populate({
      path: "constructionID",
      model: "Construction",
    }).populate({
      path: "user",
      model: "User",
    });
    console.log('amaaaaaaaaaaaaaani',construction)
    res.status(201).json({ construction });
  } catch (error) {

    console.error("Error fetching Inspections:", error);
    res.status(500).json({ error: "Failed to fetch Inspections" });
  }
};

const editConstruction = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error fetching Inspections:", error);
    res.status(500).json({ error: "Failed to fetch Inspections" });
  }
};
// Other controller methods such as updateInspection, deleteInspection, etc. can be added similarly

module.exports = {
    createContruction,
    getConstruction,
    editConstruction
};
