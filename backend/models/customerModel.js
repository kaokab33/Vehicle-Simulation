const mongoose = require("mongoose");
const vehicles = require("./vehicleModel");
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  vehicles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
  ],
});

module.exports = mongoose.model("Customer", customerSchema);
