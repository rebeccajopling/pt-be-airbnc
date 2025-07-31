const seed = require("./seed");
const { usersData, propertyTypesData, propertiesData } = require("./data/test");

seed(usersData, propertyTypesData, propertiesData);
