const db = require("./connection");
const format = require("pg-format");

const {
  formattedUsersData,
  formattedPropertyTypesData,
  formatPropertiesData,
  formatReviewsData,
} = require("./utils");

async function seed(usersData, propertyTypesData, propertiesData, reviewsData) {
  // drop tables

  await db.query(`DROP TABLE IF EXISTS reviews;`);
  await db.query(`DROP TABLE IF EXISTS properties;`);
  await db.query(`DROP TABLE IF EXISTS property_types;`);
  await db.query(`DROP TABLE IF EXISTS users;`);

  // create users table
  await db.query(`CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    surname VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    phone_number VARCHAR,
    is_host BOOLEAN NOT NULL,
    avatar VARCHAR,
    created_at TIMESTAMP DEFAULT NOW())`);

  // create property types table
  await db.query(`CREATE TABLE property_types(
  property_type VARCHAR NOT NULL PRIMARY KEY,
  description TEXT NOT NULL)`);

  // create properties table
  await db.query(`CREATE TABLE properties(
       property_id SERIAL PRIMARY KEY,
       host_id INT NOT NULL REFERENCES users(user_id),
       name VARCHAR NOT NULL,
       location VARCHAR NOT NULL,
       property_type VARCHAR NOT NULL REFERENCES property_types(property_type),
       price_per_night DECIMAL NOT NULL,
       description TEXT);`);

  // create reviews table
  await db.query(`CREATE TABLE reviews(
    review_id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES properties(property_id),
    guest_id INT NOT NULL REFERENCES users(user_id),
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW())`);

  // insert users data
  const { rows: users } = await db.query(
    format(
      `INSERT INTO users (first_name, surname, email, phone_number, is_host, avatar) VALUES %L RETURNING *`,
      formattedUsersData
    )
  );

  // insert property_types data
  await db.query(
    format(
      `INSERT INTO property_types (property_type, description) VALUES %L`,
      formattedPropertyTypesData
    )
  );

  // insert properties data
  const formattedPropertiesData = formatPropertiesData(propertiesData, users);
  const { rows: properties } = await db.query(
    format(
      `INSERT INTO properties
     (host_id, name, property_type, location, price_per_night, description)
     VALUES %L RETURNING *`,
      formattedPropertiesData
    )
  );

  const formattedReviewsData = formatReviewsData(
    reviewsData,
    properties,
    users
  );
  await db.query(
    format(
      `INSERT INTO reviews (
      property_id,
      guest_id, 
      rating,
      comment,
      created_at) VALUES %L RETURNING *`,
      formattedReviewsData
    )
  );
}

module.exports = seed;
