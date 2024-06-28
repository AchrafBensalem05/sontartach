const Inspection = require('../models/inspection');
const Manufold = require('../models/manufold');
const Pipe = require('../models/pipe');
const Well = require('../models/well');

// Controller to create a new inspection
const createInspection = async (req, res) => {
  try {
    const { pipeID, Inspection_date, observation, ficher } = req.body;
    const newInspection = new Inspection({ pipeID, Inspection_date, observation, ficher });
    const savedInspection = await newInspection.save();
    res.status(201).json({ inspection: savedInspection });
  } catch (error) {
    console.error('Error creating Inspection:', error);
    res.status(500).json({ error: 'Failed to create Inspection' });
  }
};

// Controller to get all inspections
const getAllInspections = async (req, res) => {
  try {
    console.log("Getting all Inspections");
    
    const inspections = await Inspection.find().populate({
      path:'ep_noteID',
      model:'EpNote'
    }).populate({
      path:'Ins_reportID',
      model:'InspectionDepReport'
    }).populate({
      path:'evaluationID',
      model:'Evaluation'
    }).populate({
      path:'constructionID',
      model:'Construction'
    });

    const inspectionDetails = await Promise.all(inspections.map(async (inspection) => {
      const ouvrageID = inspection.ouvrage;
      
      const ouvrage =
        (await Well.findById( ouvrageID )) ||
        (await Manufold.findById( ouvrageID )) ||
        (await Pipe.findById( ouvrageID ));
      return {
        inspection: inspection.toObject(),
        ouvrage: ouvrage ? ouvrage.toObject() : null,
      };
    }));

    console.log("Getting all Inspections with details:", inspectionDetails);

    res.status(200).json({ inspections: inspectionDetails });
  } catch (error) {
    console.error('Error fetching Inspections:', error);
    res.status(500).json({ error: 'Failed to fetch Inspections' });
  }
};

// Other controller methods such as updateInspection, deleteInspection, etc. can be added similarly

module.exports = {createInspection, getAllInspections};
