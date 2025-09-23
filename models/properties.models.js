const db = require("../db/connection");
const { checkExists } = require("../db/utils");

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
  await checkExists(
    "properties",
    "property_id",
    property_id,
    "Property Not Found"
  );

  const queryString = `
    SELECT 
      properties.property_id,
      properties.name,
      properties.location,
      properties.property_type,
      properties.price_per_night,
      properties.description,
      properties.image_url,
      users.first_name || ' ' || users.surname AS host_name,
      CASE 
        WHEN users.is_host = true THEN users.avatar
        ELSE NULL
      END AS avatar
    FROM properties
    JOIN users ON properties.host_id = users.user_id
    WHERE properties.property_id = $1;
  `;

  const queryValue = [property_id];
  const { rows } = await db.query(queryString, queryValue);
  return rows[0];
};

exports.fetchPropertyReviews = async (property_id) => {
  await checkExists(
    "properties",
    "property_id",
    property_id,
    "Property Not Found"
  );
  const queryString = "SELECT * FROM reviews WHERE property_id = $1";
  const queryValues = [property_id];

  const { rows } = await db.query(queryString, queryValues);
  return rows;
};

exports.fetchUsers = async (user_id) => {
  await checkExists("users", "user_id", user_id, "User Not Found");

  const queryString = "SELECT * FROM users WHERE user_id = $1";
  const queryValue = [user_id];

  const { rows } = await db.query(queryString, queryValue);
  return rows[0];
};

exports.fetchPropertyTypes = async () => {
  const queryString = `SELECT property_type, description FROM property_types;`;

  const { rows } = await db.query(queryString);
  return rows;
};

exports.addPropertyReview = async (property_id, guest_id, rating, comment) => {
  await checkExists(
    "properties",
    "property_id",
    property_id,
    "Property Not Found"
  );
  await checkExists("users", "user_id", guest_id, "User Not Found");

  const queryString = `
    INSERT INTO reviews (property_id, guest_id, rating, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING *`;

  const queryValues = [property_id, guest_id, rating, comment];

  const { rows } = await db.query(queryString, queryValues);
  return rows[0];
};

exports.deleteReviewById = async (review_id) => {
  await checkExists("reviews", "review_id", review_id, "Review Not Found");

  const queryString = `
    DELETE FROM reviews
    WHERE review_id = $1
    RETURNING *;
  `;

  const queryValues = [review_id];
  const { rows } = await db.query(queryString, queryValues);
  return rows;
};
