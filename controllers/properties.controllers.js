const { fetchAllProperties } = require("../models/properties.models");

exports.getAllProperties = async (req, res, next) => {
  const rows = await fetchAllProperties();
  const properties = { properties: rows };
  res.status(200).send(properties);
};
