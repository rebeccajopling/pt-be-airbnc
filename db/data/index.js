const devData = require("./dev");
const testData = require("./test");

const ENV = process.env.NODE_ENV || "development";

const data = { development: devData, production: devData, test: testData };

module.exports = data[ENV];
