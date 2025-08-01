const seed = require("./seed");
const {
  usersData,
  propertyTypesData,
  propertiesData,
  reviewsData,
} = require("./data/test");

seed(usersData, propertyTypesData, propertiesData, reviewsData);
