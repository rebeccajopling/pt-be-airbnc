const express = require("express");
const path = require("path");
const db = require("./db/connection");
const {
  getAllProperties,
  getPropertyById,
  getPropertyReviews,
  getPropertyTypes,
  getUsers,
  postPropertyReview,
  deleteReview,
} = require("./controllers/properties.controllers");

const {
  handleBadRequests,
  handleCustomErrors,
  handlePathNotFound,
} = require("./controllers/errors.controllers");

const app = express();
app.use(express.json());

app.get("/api/properties", getAllProperties);
app.get("/api/properties/:id", getPropertyById);
app.get("/api/properties/:id/reviews", getPropertyReviews);
app.get("/api/users/:id", getUsers);
app.get("/api/property-types", getPropertyTypes);
app.post("/api/properties/:id/reviews", postPropertyReview);
app.delete("/api/reviews/:id", deleteReview);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(express.static(path.join(__dirname, "public")));
app.use(handleBadRequests);
app.use(handleCustomErrors);
app.use(handlePathNotFound);

module.exports = app;
