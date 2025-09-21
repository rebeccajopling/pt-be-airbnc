require("dotenv").config({ path: ".env.dev" });

const seed = require("./seed");
const {
  usersData,
  propertyTypesData,
  propertiesData,
  reviewsData,
} = require("./data");

seed(usersData, propertyTypesData, propertiesData, reviewsData);
