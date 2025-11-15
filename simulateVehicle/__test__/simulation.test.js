const mongoose = require("mongoose");
const { updateVehicleStatuses } = require("../simulationService");

jest.mock("mongoose");

describe("Vehicle Simulation Tests", () => {
  test("updateVehicleStatuses should read and update vehicles", async () => {
    let mockCollection, mockDb;

    mongoose.connection = { db: {} };

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
    jest.useFakeTimers();

    await updateVehicleStatuses();

    expect(mockDb.collection).toHaveBeenCalledWith("vehicles");
    expect(mockCollection.find).toHaveBeenCalledWith({});
    expect(mockCollection.updateOne).toHaveBeenCalledTimes(2);
  });
});
