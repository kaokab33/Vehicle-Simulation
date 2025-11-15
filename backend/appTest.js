const cors = require("cors");
const express = require("express");
const customerRouter = require("./routes/customerRoutes");
const vehicleRouter = require("./routes/vehicleRoutes");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/vehicles", vehicleRouter);

module.exports = app;
