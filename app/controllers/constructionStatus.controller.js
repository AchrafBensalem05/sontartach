const ConstructionStatus = require("../models/Constructionstatus");

// Controller to create a new inspection
const createContructionStatus = async (req, res) => {
  try {
    const { status, InspectionID, date } = req.body;
    console.log("foooooooooooooooooo");
    const constructionStatusinstance = new ConstructionStatus({
      InspectionID: InspectionID,
      status: status,
      date: date,
    });
    console.log(InspectionID, "oppppppppp");
    const savedconstructionStatusinstance =await constructionStatusinstance.save();

    console.log("Updated statuuuuuuuus:", savedconstructionStatusinstance);
    res.status(201).json({
      message: "Your construction status sent successfully",
      savedconstructionStatusinstance,
    });
  } catch (error) {
    console.error("Error creating Inspection:", error);
    res.status(500).json({ error: "Failed to create Inspection" });
  }
};

// Controller to get all inspections
const getConstructionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const ConstructionStatusinstance = await ConstructionStatus.find({InspectionID:id })
    console.log("ConstructionStatus",ConstructionStatusinstance)
    res.status(201).json({
      ConstructionStatusinstance,
    });
  } catch (error) {
    console.error("Error fetching Inspections:", error);
    res.status(500).json({ error: "Failed to fetch Inspections" });
  }
};

const editConstructionStatus = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error fetching Inspections:", error);
    res.status(500).json({ error: "Failed to fetch Inspections" });
  }
};
// Other controller methods such as updateInspection, deleteInspection, etc. can be added similarly

module.exports = {
    createContructionStatus,
    getConstructionStatus,
    editConstructionStatus
};
