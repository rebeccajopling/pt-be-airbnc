const express = require("express");
const db = require("./db/connection");
const {
  getAllProperties,
  getPropertyById,
  getPropertyReviews,
  getUsers,
  postPropertyReview,
  deleteReview,
} = require("./controllers/properties.controllers");

const app = express();
app.use(express.json());

app.get("/api/properties", getAllProperties);
app.get("/api/properties/:id", getPropertyById);
app.get("/api/properties/:id/reviews", getPropertyReviews);
app.get("/api/users/:id", getUsers);
app.post("/api/properties/:id/reviews", postPropertyReview);
app.delete("/api/reviews/:id", deleteReview);

module.exports = app;
