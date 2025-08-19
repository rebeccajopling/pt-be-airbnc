const express = require("express");
const db = require("./db/connection");
const {
  getAllProperties,
  getPropertiesByType,
} = require("./controllers/properties.controllers");

const app = express();
app.use(express.json());

app.get("/api/properties", getAllProperties);

module.exports = app;
