const Telemetry = require('../models/telemetry');

// Controller function to handle incoming telemetry data
const receiveTelemetryData = async (req, res) => {
    try {
        const { ID, date, attributes } = req.body;
        // Assuming attributes contain pressure and temperature data
        const telemetryData = new Telemetry({ ID, date, attributes });
        await telemetryData.save();
        res.status(201).send('Telemetry data received and saved successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving telemetry data.');
    }
};

module.exports = {
    receiveTelemetryData
};
