const { getNextId } = require("../../functions");
const EpNote = require("../models/Epnote");
const Inspection = require("../models/inspection");
const InspectionDepReport = require("../models/inspectionDepReport");

// Controller to create a new inspection
const createInspectionDepReport = async (req, res) => {
  try {
    const specialId = await getNextId('inspection_report');
    const { type, message,InspectionID,user} = req.body;
    console.log("foooooooooooooooooo");
    const filePath = req.file.path;
    console.log("pvvvvvvvvvvvvvvvv", filePath);
    const inspectionDepReportinstance = new InspectionDepReport({
      message: message,
      version:type,
      ficher: filePath,
      date: new Date(),
      ID:specialId,
      user:user
    });
    console.log(InspectionID,'oppppppppp')
    const savedInspectionDepReport = await inspectionDepReportinstance.save();
    console.log('ttttttttttttttt',savedInspectionDepReport)
    const inspectionFound = await Inspection.findById(InspectionID)
    console.log('inspectionFound',inspectionFound)
    const updatedInspection = await Inspection.findByIdAndUpdate(
      InspectionID,
      { 
        Ins_reportID: savedInspectionDepReport._id,
        status: 'evaluation'
       },
    );

    if (!updatedInspection) {
      return res.status(404).json({ error: "Inspection not found" });
    }

    console.log('Updated Inspection:', updatedInspection);
    res
      .status(201)
      .json({ message: "Your insp report sent successfully", updatedInspection });
  } catch (error) {
    console.error("Error creating Inspection:", error);
    res.status(500).json({ error: "Failed to create Inspection" });
  }
};

// Controller to get all inspections
const getInspectionDepReport = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('amaaaaaaaaaaaaaani',id)

    const inspectionReport = await Inspection.findById(id).populate({
      path: "Ins_reportID",
      model: "InspectionDepReport",
      populate:{
        path: "user",
        model: "User",
      }
    });
    console.log('amaaaaaaaaaaaaaani',inspectionReport)
    res.status(201).json({ inspectionReport });
  } catch (error) {

    console.error("Error fetching Inspections:", error);
    res.status(500).json({ error: "Failed to fetch Inspections" });
  }
};

const editInspectionDepReport = async (req, res) => {
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
      path:'Ins_reportID',
      model:'InspectionDepReport'
    });

    console.log('benchaiba islaaaaaaaaaaam',inspection)
    if (!inspection || !inspection.ep_noteID.ficher) {
      return res.status(404).send({ message: 'File not found' });
    }
    console.log(inspection.Ins_reportID.ficher,'fiiiiriiiiiiiiiiiile')
    
    const filePath = inspection.Ins_reportID.ficher;
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
  createInspectionDepReport,
  getInspectionDepReport,
  editInspectionDepReport,
  downloadFiles
};
