const db = require("./connection");
const format = require("pg-format");

const {
  formattedUsersData,
  formattedPropertyTypesData,
  formattedPropertiesData,
} = require("./utils");

async function seed(usersData, propertyTypesData, propertiesData) {
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

  // create property type table
  await db.query(`CREATE TABLE property_types(
  property_type VARCHAR NOT NULL PRIMARY KEY,
  description TEXT NOT NULL)`);

  // create properties table
  await db.query(`CREATE TABLE properties(
       property_id SERIAL PRIMARY KEY,
       host_id INT NOT NULL REFERENCES users(user_id),
       host_name VARCHAR NOT NULL,
       name VARCHAR NOT NULL,
       location VARCHAR NOT NULL,
       property_type VARCHAR NOT NULL REFERENCES property_types(property_type),
       price_per_night DECIMAL NOT NULL,
       description TEXT, 
       amenities TEXT[] );`);

  // create reviews table
  await db.query(`CREATE TABLE reviews(
    review_id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES properties(property_id),
    guest_id INT NOT NULL REFERENCES users(user_id),
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW())`);

  // insert users data
  await db.query(
    format(
      `INSERT INTO users (first_name, surname, email, phone_number, is_host, avatar) VALUES %L`,
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

  // insert into properties data
  await db.query(
    format(
      `INSERT INTO properties (name,
    property_type,
    location,
    price_per_night,
    description,
    host_name,
    amenities) VALUES %L`,
      formattedPropertiesData
    )
  );
}

module.exports = seed;
