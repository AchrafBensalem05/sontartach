const { getNextId } = require("../../functions");
const EpNote = require("../models/Epnote");
const Evaluation = require("../models/evaluation");
const Inspection = require("../models/inspection");
const InspectionDepReport = require("../models/inspectionDepReport");
const OuvrageStatus = require("../models/ouvrageStatus");

// Controller to create a new inspection
const createResult = async (req, res) => {
  try {
    const specialId = await getNextId("result");
    const { observation, status, next_inspection, inspection_id, ouvrage_id } =
      req.body;
    console.log("foooooooooooooooooo");
    const ouvrageStatusInstance = new OuvrageStatus({
      observation: observation,
      status: status,
      ID:specialId,
      next_inspection: next_inspection,
      inspection_id: inspection_id,
      ouvrage_id: ouvrage_id,
    });
    console.log(inspection_id, "oppppppppp");
    const statusOuvrage = await ouvrageStatusInstance.save();
    const updatedInspection = await Inspection.findByIdAndUpdate(
      inspection_id,
      { 
        status: 'updated'
       },
    );

    if (!updatedInspection) {
      return res.status(404).json({ error: "Inspection not found" });
    }
    console.log("ttttttttttttttt", statusOuvrage);
    console.log("Updated Inspection:", statusOuvrage);
    res.status(201).json({
      statusOuvrage,
    });
  } catch (error) {
    console.error("Error creating Inspection:", error);
    res.status(500).json({ error: "Failed to create Inspection" });
  }
};

// Controller to get all inspections
const getResult = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("amaaaaaaaaaaaaaani", id);
    const inspectionResult = await OuvrageStatus.findOne({inspection_id:id})
    console.log("amaaaaaaaaaaaaaani", inspectionResult);
    res.status(201).json({ inspectionResult });
  } catch (error) {
    console.error("Error fetching Inspections:", error);
    res.status(500).json({ error: "Failed to fetch Inspections" });
  }
};

const editEvaluation = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error fetching Inspections:", error);
    res.status(500).json({ error: "Failed to fetch Inspections" });
  }
};
// Other controller methods such as updateInspection, deleteInspection, etc. can be added similarly

module.exports = {
  createResult,
  getResult,
};
