const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./../backend/config.env" });
const repetTime = 60000;
const DB = process.env.MONGO_URI;

async function updateVehicleStatuses() {
  try {
    const db = mongoose.connection.db;
    const vehiclesCollection = db.collection("vehicles");

    const vehicles = await vehiclesCollection.find({}).toArray();
    console.log(`Found ${vehicles.length} vehicles`);

    for (const vehicle of vehicles) {
      const status = Math.random() < 0.5 ? "Connected" : "Disconnected";

      await vehiclesCollection.updateOne(
        { _id: vehicle._id },
        {
          $set: {
            status: status,
          },
        }
      );
    }
  } catch (error) {
    console.error("Error updating vehicle statuses:", error.message);
  }
}

async function startSimulation() {
  try {
    await mongoose.connect(DB, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    await updateVehicleStatuses();
    setInterval(updateVehicleStatuses, repetTime);
  } catch (err) {
    console.log("DB connection failed:", err.message);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") {
  startSimulation();
}

module.exports = { updateVehicleStatuses };
