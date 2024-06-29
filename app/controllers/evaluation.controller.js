const { getNextId } = require("../../functions");
const EpNote = require("../models/Epnote");
const Evaluation = require("../models/evaluation");
const Inspection = require("../models/inspection");
const InspectionDepReport = require("../models/inspectionDepReport");

// Controller to create a new inspection
const createEvaluation = async (req, res) => {
  try {
    const specialId = await getNextId('evaluation');
    const { message, evaluation, pv_evaluation, InspectionID,user } = req.body;
    console.log("foooooooooooooooooo");
    const filePath = req.file ? req.file.path : "";
    console.log("pvvvvvvvvvvvvvvvv", filePath);
    const evaluationinstance = new Evaluation({
      message: message,
      result: evaluation,
      ficher: filePath,
      date: new Date(),
      ID:specialId,
      user:user
    });
    console.log(InspectionID, "oppppppppp");
    const savedEvaluationinstance = await evaluationinstance.save();

    console.log("ttttttttttttttt", savedEvaluationinstance);
    const inspectionFound = await Inspection.findById(InspectionID);
    console.log("inspectionFound", inspectionFound);
    const updatedInspection = await Inspection.findByIdAndUpdate(InspectionID, {
      evaluationID: savedEvaluationinstance._id,
      status: evaluationinstance==="close" ? 'closed' : 'construction'
    },
    

  );

    if (!updatedInspection) {
      return res.status(404).json({ error: "Inspection not found" });
    }

    console.log("Updated Inspection:", updatedInspection);
    res.status(201).json({
      message: "Your insp report sent successfully",
      updatedInspection,
    });
  } catch (error) {
    console.error("Error creating Inspection:", error);
    res.status(500).json({ error: "Failed to create Inspection" });
  }
};

// Controller to get all inspections
const getEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("amaaaaaaaaaaaaaani", id);
    const inspectionEvaluation = await Inspection.findById(id).populate({
      path: "evaluationID",
      model: "Evaluation",
      populate:{
        path: "user",
        model: "User",
      }
    });
    console.log("amaaaaaaaaaaaaaani", inspectionEvaluation);
    res.status(201).json({ inspectionEvaluation });
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
const downloadFiles = async (req, res) => {
  console.log("rrrrrrrrrrrrrr");
  const fileType='fichier'
  const { id } = req.params;
  console.log('staaaaaaaartt', fileType);
  try {
    const inspection = await Inspection.findById(id).populate({
      path:'evaluationID',
      model:'evaluation'
    });

    console.log('benchaiba islaaaaaaaaaaam',inspection)
    if (!inspection || !inspection.evaluationID.ficher) {
      return res.status(404).send({ message: 'File not found' });
    }
    console.log(inspection.evaluationID.ficher,'fiiiiriiiiiiiiiiiile')
    
    const filePath = inspection.evaluationID.ficher;
    console.log('looooooooooooove',filePath)
    if (!fs.existsSync(filePath)) {
      return res.status(404).send({ message: 'File not found' });
    }
    console.log("ccoooooooooooooooo",filePath)

    res.download(filePath, err => {
      if (err) {
        res.status(500).send({ message: err.message });
        console.log("errrrrrrrrrrrrrrrror")
      }
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
module.exports = {
  createEvaluation,
  getEvaluation,
  editEvaluation,
  downloadFiles
};
