const db = require("../db/connection");

exports.getValidPropertyTypes = async () => {
  const result = await db.query(`
    SELECT property_type FROM property_types;
  `);
  return result.rows.map((row) => row.property_type);
};

exports.fetchAllProperties = async (
  property_type,
  minprice,
  maxprice,
  sort,
  order
) => {
  if (property_type) {
    const validPropertyTypes = await this.getValidPropertyTypes();
    if (!validPropertyTypes.includes(property_type)) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }
  }

  if (minprice && isNaN(Number(minprice))) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (maxprice && isNaN(Number(maxprice))) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (sort && sort !== "cost_per_night") {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }

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

  if (sort === "cost_per_night") {
    let sortOrder = "ASC";
    if (order === "descending") {
      sortOrder = "DESC";
    }
    queryString += ` ORDER BY price_per_night ${sortOrder}`;
  }

  const { rows } = await db.query(queryString, queryValue);
  return rows;
};

exports.fetchPropertyById = async (property_id) => {
  let queryString = "SELECT * FROM properties";
  const queryValue = [];

  if (property_id) {
    queryValue.push(property_id);
    queryString += " WHERE property_id = $1";
  }
  const { rows } = await db.query(queryString, queryValue);
  if (!rows.length) {
    return Promise.reject({ status: 404, msg: "Property Not Found" });
  }
  return rows[0];
};

exports.fetchPropertyReviews = async (property_id) => {
  let queryString = "SELECT * FROM reviews";
  const queryValue = [];

  if (property_id) {
    queryValue.push(property_id);
    queryString += " WHERE property_id = $1";
  }

  const { rows } = await db.query(queryString, queryValue);
  return rows;
};

exports.fetchUsers = async (user_id) => {
  let queryString = "SELECT * FROM users";
  const queryValue = [];

  if (user_id) {
    queryValue.push(user_id);
    queryString += " WHERE user_id = $1";
  }

  const { rows } = await db.query(queryString, queryValue);
  if (!rows.length) {
    return Promise.reject({ status: 404, msg: "User Not Found" });
  }
  return rows[0];
};

exports.addPropertyReview = async (property_id, guest_id, rating, comment) => {
  const queryString = `
    INSERT INTO reviews (property_id, guest_id, rating, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING *`;

  const queryValues = [property_id, guest_id, rating, comment];

  const { rows } = await db.query(queryString, queryValues);
  return rows[0];
};

exports.deleteReviewById = async (review_id) => {
  const queryString = `
    DELETE FROM reviews
    WHERE review_id = $1
    RETURNING *;
  `;

  const queryValue = [review_id];
  const { rows } = await db.query(queryString, queryValue);

  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Review Not Found" });
  }
  return;
};
