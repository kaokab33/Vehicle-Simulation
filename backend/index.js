const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const customerRouter = require("./routes/customerRoutes");
const vehichelRouter = require("./routes/vehicleRoutes");
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
const DB = process.env.MONGO_URI;
console.log(DB);
mongoose
  .connect(DB, {})
  .then(() => {
    console.log("DB connection successful!");
  })
  .catch((err) => console.log("DB connection error:", err));

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/vehicles", vehichelRouter);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
