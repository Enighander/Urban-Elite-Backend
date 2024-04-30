require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mainRouter = require("./src/routes/index.js");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT;
const passDB = process.env.PASS_DB

app.use(express.json());
app.use(cors());

mongoose
  .connect(
    `mongodb+srv://enighander:${passDB}@backenddb.ejlvhbh.mongodb.net/UrbanElite-e-commerce-API?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to database");
    app.use("/api/v1", mainRouter);
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Connection Failed", err);
  });
