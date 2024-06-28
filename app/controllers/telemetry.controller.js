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

const sendTelemetryData = async (req, res) => {
    try {
        const data = await Telemetry.find({}).sort({ _id: -1 }).limit(20)

        const transformedData = data.map(item => {
            const dateString = item.date;
            const date = new Date(dateString);
            const hour = date.getHours();
            const minutes = date.getMinutes();
            const timeString = `${hour}:${minutes.toString().padStart(2, '0')}`;
          
            const pressure = roundToNearestHalfInteger(item.attributes.find(attr => attr.name === 'pressure').value);
            const temperature = roundToNearestHalfInteger(item.attributes.find(attr => attr.name === 'temperature').value);
          
            return {
              date: timeString,
              pressure,
              temperature,
              ID: item.ID
            };
          });
          
          console.log(transformedData);

        res.status(200).json(transformedData);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving telemetry data.');
    }
};
function roundToNearestHalfInteger(value) {
    const roundedValue = Math.round(value * 2) / 2;
    return Number(roundedValue.toFixed(1));
  }
module.exports = {
    receiveTelemetryData,
    sendTelemetryData
};
