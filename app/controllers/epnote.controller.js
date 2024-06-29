const { getNextId } = require("../../functions");
const EpNote = require("../models/Epnote");
const Inspection = require("../models/inspection");
const Manufold = require("../models/manufold");
const Pipe = require("../models/pipe");
const Well = require("../models/well");
const fs = require("fs");

// Controller to create a new inspection
const createEpNote = async (req, res) => {

  try {
    const specialId = await getNextId('ep_note');
    const { ouvrage, type, message, pv_file,user } = req.body;
    console.log("foooooooooooooooooo");
    const filePath = req.file.path;
    console.log("pvvvvvvvvvvvvvvvv", filePath);
    // let filePath = "";
    // if (uploadedFile) {
    //   filePath = uploadedFile.path;
    // } else {
    //   console.log("No file provided");
    // }
    const epnote = new EpNote({
      email: email || "",
      message: message,
      ficher: filePath,
      date: new Date(),
      ID:specialId
    });
    const savedEpNote = await epnote.save();
    const inspection = new Inspection({
      ouvrage: ouvrage,
      ouvrage_type: type,
      inspection_date: new Date(),
      ep_noteID: epnote._id,
      status:'inspection',
      user:user
    });
    const savedInspection = await inspection.save();
    res
      .status(201)
      .json({ message: "Your note successfully", savedInspection });
  } catch (error) {
    console.error("Error creating Inspection:", error);
    res.status(500).json({ error: "Failed to create Inspection" });
  }
};

// Controller to get all inspections
const getEpNote = async (req, res) => {
  console.log("reeeeeeeeeeee");
  try {
    const { id } = req.params;
    const inspection = await Inspection.findById(id).populate({
      path: "ep_noteID",
      model: "EpNote",
    }).populate({
      path: "user",
      model: "User",
    });
    const ouvrageID = inspection.ouvrage;
    console.log(ouvrageID, "ooooooooooo");
    const ouvrage =
      (await Well.findById( ouvrageID )) ||
      (await Manufold.findById( ouvrageID )) ||
      (await Pipe.findById( ouvrageID ));

    console.log("tyyyyyyyyyyy", ouvrage);
    console.log("iiiiiiooooooo", inspection);
    const inspectionData={
      ouvrage:ouvrage,
      inspection:inspection,
    }
    res.status(201).json({ inspectionData });
  } catch (error) {
    console.error("Error fetching Inspections:", error);
    res.status(500).json({ error: "Failed to fetch Inspections" });
  }
};

const editEpNote = async (req, res) => {
  try {
    const { id } = req.params;
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
      path:'ep_noteID',
      model:'EpNote'
    });

    console.log('benchaiba islaaaaaaaaaaam',inspection)
    if (!inspection || !inspection.ep_noteID.ficher) {
      return res.status(404).send({ message: 'File not found' });
    }
    console.log(inspection.ep_noteID.ficher,'fiiiiriiiiiiiiiiiile')
    
    const filePath = inspection.ep_noteID.ficher;
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
module.exports = { editEpNote, getEpNote, createEpNote,downloadFiles };
