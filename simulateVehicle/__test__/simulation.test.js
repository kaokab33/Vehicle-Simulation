jest.mock("mongoose", () => ({
  connection: {},
}));

const mongoose = require("mongoose");
const { updateVehicleStatuses } = require("../simulationService");

describe("Vehicle Simulation Tests", () => {
  let mockDb;
  let mockCollection;

  beforeEach(() => {
    mockCollection = {
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([
          { _id: "1", status: "Connected" },
          { _id: "2", status: "Disconnected" },
        ]),
      }),
      updateOne: jest.fn().mockResolvedValue({}),
    };

    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    mongoose.connection.db = mockDb;

    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("updateVehicleStatuses should read and update vehicles", async () => {
    await updateVehicleStatuses();

    expect(mockDb.collection).toHaveBeenCalledWith("vehicles");
    expect(mockCollection.find).toHaveBeenCalledWith({});
    expect(mockCollection.updateOne).toHaveBeenCalledTimes(2);
  });
});
