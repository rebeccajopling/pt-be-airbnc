const db = require("../db/connection");

exports.fetchAllProperties = async (
  property_type,
  minprice,
  maxprice,
  sort,
  order
) => {
  let queryString = "SELECT * FROM properties";

  const queryValue = [];

  if (property_type) {
    queryValue.push(property_type);
    queryString += " WHERE property_type = $1";
  }

  if (minprice) {
    if (queryValue.length) {
      queryString += " AND";
    } else {
      queryString += " WHERE";
    }
    queryValue.push(minprice);
    queryString += ` price_per_night >= $${queryValue.length}`;
  }

  if (maxprice) {
    if (queryValue.length) {
      queryString += " AND";
    } else {
      queryString += " WHERE";
    }
    queryValue.push(maxprice);
    queryString += ` price_per_night <= $${queryValue.length}`;
  }

  if (sort) {
    if (sort !== "cost_per_night") {
      throw new Error(
        "Invalid 'sort' value. Only 'cost_per_night' is supported."
      );
    }

    let sortOrder = "ASC";
    if (order === "descending") {
      sortOrder = "DESC";
    }
    queryString += ` ORDER BY price_per_night ${sortOrder}`;
  }

  const { rows } = await db.query(queryString, queryValue);
  return rows;
};
