const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seed");

const {
  usersData,
  propertyTypesData,
  propertiesData,
  reviewsData,
} = require("../db/data/test");

beforeEach(() =>
  seed(usersData, propertyTypesData, propertiesData, reviewsData)
);

describe("app", () => {
  describe("GET - /api/properties", () => {
    test("responds with status of 200", async () => {
      await request(app).get("/api/properties").expect(200);
    });
  });
});
