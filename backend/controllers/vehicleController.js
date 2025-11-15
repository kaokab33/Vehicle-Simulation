const Vechicle = require("../models/vehicleModel");
const Customer = require("../models/customerModel");
exports.getAllVehicles = async (req, res) => {
  try {
    const { status, customerId } = req.query;
    if (customerId) {
      const customer = await Customer.findById(customerId).populate({
        path: "vehicles",
        match: status ? { status } : {},
      });
      if (!customer) {
        return res.status(404).json({
          status: "fail",
          message: "Customer not found",
        });
      } else {
        res.status(200).json({
          status: "success",
          length: customer.vehicles.length,
          data: {
            customer,
          },
        });
      }
    } else {
      const filter = status ? { status } : {};
      const vehicles = await Vechicle.find(filter);
      res.status(200).json({
        status: "success",
        length: vehicles.length,
        data: {
          vehicles,
        },
      });
    }
  } catch (error) {
    res.status(404).json({ status: "fail", message: error.message });
  }
};
