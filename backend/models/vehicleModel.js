const mongoose = require("mongoose");
const vehiclesSchema = new mongoose.Schema({
  vin: {
    type: String,
  },
  regNr: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Disconnected", "Connected"],
    default: "Connected",
  },
});

module.exports = mongoose.model("Vehicle", vehiclesSchema);
