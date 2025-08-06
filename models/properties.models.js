const db = require("../db/connection");

exports.fetchAllProperties = async () => {
  const { rows } = await db.query("SELECT * FROM properties;");
  return rows;
};
