const mongoose = require("mongoose");
const Customer = require("../models/customerModel");
const Vehicle = require("../models/vehicleModel");
const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const DB = process.env.MONGO_URI;

async function seed() {
  try {
    await mongoose.connect(DB, {});

    await Customer.deleteMany({});
    await Vehicle.deleteMany({});

    const kallesVehicles = await Vehicle.insertMany([
      { vin: "YS2R4X20005399401", regNr: "ABC123", status: "Connected" },
      { vin: "VLUR4X20009093588", regNr: "DEF456", status: "Disconnected" },
      { vin: "VLUR4X20009048022", regNr: "GHI789", status: "Connected" },
    ]);

    const johansVehicles = await Vehicle.insertMany([
      { vin: "YS2R4X20005388011", regNr: "JKL012", status: "Connected" },
      { vin: "YS2R4X20005387949", regNr: "MNO345", status: "Disconnected" },
    ]);

    const haraldsVehicles = await Vehicle.insertMany([
      { vin: "VLUR4X20009048066", regNr: "PQR678", status: "Connected" },
      { vin: "YS2R4X20005387055", regNr: "STU901", status: "Disconnected" },
    ]);

    await Customer.insertMany([
      {
        name: "Kalles Grustransporter AB",
        address: "Cementvägen 8, 111 11 Södertälje",
        vehicles: kallesVehicles.map((v) => v._id),
      },
      {
        name: "Johans Bulk AB",
        address: "Balkvägen 12, 222 22 Stockholm",
        vehicles: johansVehicles.map((v) => v._id),
      },
      {
        name: "Haralds Värdetransporter AB",
        address: "Budgetvägen 1, 333 33 Uppsala",
        vehicles: haraldsVehicles.map((v) => v._id),
      },
    ]);

    console.log("Seed data added successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding data:", err);
    mongoose.connection.close();
  }
}

seed();
