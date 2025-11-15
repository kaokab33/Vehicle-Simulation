const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Vehicle = require("../models/vehicleModel");
const Customer = require("../models/customerModel");
const app = require("./../appTest");

let mongoServer;
let customer1;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Test Route /vehicle", () => {
  describe("Test Get All Vehicle", () => {
    let req, res;
    beforeEach(async () => {
      await Vehicle.deleteMany();
      await Customer.deleteMany();

      const vehicles = await Vehicle.create([
        { vin: "A1", status: "Connected", regNr: "111" },
        { vin: "A2", status: "Disconnected", regNr: "222" },
        { vin: "A3", status: "Connected", regNr: "333" },
      ]);

      const customers = await Customer.create([
        { name: "Karim", vehicles: [vehicles[2]._id] },
        { name: "Omer", vehicles: [] },
      ]);
      customer1 = customers[0];
    });
    test(" Test Get All Vehicle Without query", async () => {
      res = await request(app).get("/api/v1/vehicles");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
    });

    test("should filter vehicles by status", async () => {
      res = await request(app)
        .get("/api/v1/vehicles")
        .query({ status: "Connected" });

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
    test("Test Get All Vehicles With query customerId", async () => {
      res = await request(app)
        .get("/api/v1/vehicles")
        .query({ customerId: customer1._id.toString() });
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    test("Test Get All Vehicles With both customerId and status", async () => {
      const res = await request(app)
        .get("/api/v1/vehicles")
        .query({ customerId: customer1._id.toString(), status: "Connected" });
      console.log(res.body);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    test("Customer Not Found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get("/api/v1/vehicles")
        .query({ customerId: fakeId.toString() });

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/Customer not found/i);
    });
  });
});
