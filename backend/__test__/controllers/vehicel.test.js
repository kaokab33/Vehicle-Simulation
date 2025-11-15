const Vehicle = require("../../models/vehicleModel");
const Customer = require("../../models/customerModel");
const { getAllVehicles } = require("../../controllers/vehicleController");
jest.mock("../../models/vehicleModel");
jest.mock("../../models/customerModel");

describe("Test Route /vehicle", () => {
  describe("Test Get All Vehicle", () => {
    let req, res;
    beforeEach(() => {
      req = { query: {} };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
    test(" Test Get All Vehicle Without query", async () => {
      const mockVehicles = [
        { vin: "YS2R4X20005399401", regNr: "ABC123", status: "Connected" },
        { vin: "VLUR4X20009093588", regNr: "DEF456", status: "Disconnected" },
        { vin: "VLUR4X20009048022", regNr: "GHI789", status: "Connected" },
      ];
      Vehicle.find.mockResolvedValue(mockVehicles);
      await getAllVehicles(req, res);

      expect(Vehicle.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        length: 3,
        data: {
          vehicles: mockVehicles,
        },
      });
    });

    test("should filter vehicles by status", async () => {
      req.query = { status: "Connected" };

      const mockFiltered = [
        { vin: "YS2R4X20005399401", regNr: "ABC123", status: "Connected" },
      ];

      Vehicle.find.mockResolvedValue(mockFiltered);

      await getAllVehicles(req, res);

      expect(Vehicle.find).toHaveBeenCalledWith({ status: "Connected" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        length: 1,
        data: { vehicles: mockFiltered },
      });
    });
    test(" Test Get All Vehicle With query customId", async () => {
      req.query = { customerId: "123" };
      const mockCustomer = {
        id: "123",
        vehicles: [
          { vin: "AAA", status: "Connected" },
          { vin: "BBB", status: "Disconnected" },
        ],
      };
      Customer.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockCustomer),
      });
      await getAllVehicles(req, res);
      expect(Customer.findById).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        length: 2,
        data: { customer: mockCustomer },
      });
    });
    test(" Test Get All Vehicle With both customId and status", async () => {
      req.query = { customerId: "123", status: "Connected" };
      const mockCustomer = {
        id: "123",
        vehicles: [{ vin: "AAA", status: "Connected" }],
      };
      Customer.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockCustomer),
      });
      await getAllVehicles(req, res);
      expect(Customer.findById).toHaveBeenCalledWith("123");
      expect(Customer.findById().populate).toHaveBeenCalledWith({
        path: "vehicles",
        match: { status: "Connected" },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        length: 1,
        data: { customer: mockCustomer },
      });
    });

    test("Throw Error", async () => {
      Vehicle.find.mockRejectedValue(new Error("Error"));
      await getAllVehicles(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "fail",
        message: "Error",
      });
    });
    test("Customer Not Found", async () => {
      req.query = { customerId: "dasdas" };
      Customer.findById.mockImplementation(() => {
        throw new Error("Customer Not Found");
      });
      await getAllVehicles(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "fail",
        message: "Customer Not Found",
      });
    });
  });
});
