const Inspection = require("../models/inspection");
const Manufold = require("../models/manufold");
const Pipe = require("../models/pipe");
const Well = require("../models/well");

// Controller to create a new inspection
const createInspection = async (req, res) => {
  try {
    const { pipeID, Inspection_date, observation, ficher } = req.body;
    const newInspection = new Inspection({
      pipeID,
      Inspection_date,
      observation,
      ficher,
    });
    const savedInspection = await newInspection.save();
    res.status(201).json({ inspection: savedInspection });
  } catch (error) {
    console.error("Error creating Inspection:", error);
    res.status(500).json({ error: "Failed to create Inspection" });
  }
};
const getStats = async (req, res) => {
  try {
    console.log("Getting stats...");
    const stats = await Inspection.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          inspection: {
            $sum: {
              $cond: [{ $eq: ["$status", "inspection"] }, 1, 0],
            },
          },
          evaluation: {
            $sum: {
              $cond: [{ $eq: ["$status", "evaluation"] }, 1, 0],
            },
          },
          construction: {
            $sum: {
              $cond: [{ $eq: ["$status", "construction"] }, 1, 0],
            },
          },
          closed: {
            $sum: {
              $cond: [{ $eq: ["$status", "closed"] }, 1, 0],
            },
          },

          finished: {
            $sum: {
              $cond: [{ $eq: ["$status", "inspection"] }, 1, 0],
            },
          },
          updated: {
            $sum: {
              $cond: [{ $eq: ["$status", "updated"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          inspection: 1,
          evaluation: 1,
          construction: 1,
          closed: 1,
          finished: 1,
          updated: 1,

        },
      },
    ]);

    // The result will be an array with one object, so we take the first element
    const result = stats[0] || {
      total: 0,
      finished: 0,
      evaluation: 0,
      inspection: 0,
    };
    console.log(result, "total of oooooo");
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting inspection stats:", error);
    res.status(500).json({ error: "Failed to get inspection stats" });
  }
};
// Controller to get all inspections
const getAllInspections = async (req, res) => {
  try {
    console.log("Getting all Inspections");

    const inspections = await Inspection.find()
      .populate({
        path: "ep_noteID",
        model: "EpNote",
      })
      .populate({
        path: "Ins_reportID",
        model: "InspectionDepReport",
      })
      .populate({
        path: "evaluationID",
        model: "Evaluation",
      })
      .populate({
        path: "constructionID",
        model: "Construction",
      });

    const inspectionDetails = await Promise.all(
      inspections.map(async (inspection) => {
        const ouvrageID = inspection.ouvrage;

        const ouvrage =
          (await Well.findById(ouvrageID)) ||
          (await Manufold.findById(ouvrageID)) ||
          (await Pipe.findById(ouvrageID));
        return {
          inspection: inspection.toObject(),
          ouvrage: ouvrage ? ouvrage.toObject() : null,
        };
      })
    );

    console.log("Getting all Inspections with details:", inspectionDetails);

    res.status(200).json({ inspections: inspectionDetails });
  } catch (error) {
    console.error("Error fetching Inspections:", error);
    res.status(500).json({ error: "Failed to fetch Inspections" });
  }
};
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
// Other controller methods such as updateInspection, deleteInspection, etc. can be added similarly

module.exports = { createInspection, getAllInspections, getStats };
