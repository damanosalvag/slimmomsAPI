const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("./config/config-passport");

const usersRouter = require("./routes/api/users");
const productsRouter = require("./routes/api/products.js");
const daysRouter = require("./routes/api/days.js");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/", productsRouter);
app.use("/api/days", daysRouter);


app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.log("enter here");
  res.status(500).json({ message: err.message });
  console.log("error", err);
});

module.exports = app;
