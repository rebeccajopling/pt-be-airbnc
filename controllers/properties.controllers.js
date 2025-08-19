const { fetchAllProperties } = require("../models/properties.models");

exports.getAllProperties = async (req, res, next) => {
  const { property_type, minprice, maxprice, sort, order } = req.query;
  try {
    const properties = await fetchAllProperties(
      property_type,
      minprice,
      maxprice,
      sort,
      order
    );
    return res.status(200).send({ properties: properties });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
