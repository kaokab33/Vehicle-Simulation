const Customer = require("../../models/customerModel");
const { getAllCustomers } = require("../../controllers/customerController");
jest.mock("../../models/customerModel");

describe("Test Route /customer", () => {
  describe("Test Get All Cutomers", () => {
    let req, res;
    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
    test("should return 200 and list of customers", async () => {
      const mockCustomers = [
        {
          name: "Kalles Grustransporter AB",
          address: "Cementvägen 8, 111 11 Södertälje",
        },
        {
          name: "Johans Bulk AB",
          address: "Balkvägen 12, 222 22 Stockholm",
        },
        {
          name: "Haralds Värdetransporter AB",
          address: "Budgetvägen 1, 333 33 Uppsala",
        },
      ];
      Customer.find.mockResolvedValue(mockCustomers);
      await getAllCustomers(req, res);

      expect(Customer.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        length: 3,
        data: {
          customers: mockCustomers,
        },
      });
    });
    test("Throw Error", async () => {
      Customer.find.mockRejectedValue(new Error("Error"));
      await getAllCustomers(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "fail",
        message: "Error",
      });
    });
  });
});
