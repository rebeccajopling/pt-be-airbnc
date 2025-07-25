const db = require("./connection");

async function seed() {
  // drop properties table
  await db.query(`DROP TABLE IF EXISTS properties;`);

  // create properties table
  await db.query(`CREATE TABLE properties(
       property_id SERIAL PRIMARY KEY,
       host_id INT,
       name VARCHAR,
       location VARCHAR,
       property_type VARCHAR,
       price_per_night DECIMAL,
       description TEXT );`);
}
