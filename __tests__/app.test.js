const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seed");
const matchers = require("jest-sorted");
expect.extend(matchers);

const {
  usersData,
  propertyTypesData,
  propertiesData,
  reviewsData,
} = require("../db/data/test");

beforeEach(() => {
  return seed(usersData, propertyTypesData, propertiesData, reviewsData);
});

afterAll(() => db.end());

describe("app", () => {
  describe("GET - /api/properties", () => {
    test("responds with status of 200", async () => {
      const { body } = await request(app).get("/api/properties").expect(200);
      expect(body.properties.length).toBeGreaterThan(0);
      body.properties.forEach((property) => {
        expect(typeof property.property_id).toBe("number");
        expect(typeof property.host_id).toBe("number");
        expect(typeof property.name).toBe("string");
        expect(typeof property.location).toBe("string");
        expect(typeof property.property_type).toBe("string");
        expect(typeof property.price_per_night).toBe("string");
        expect(typeof property.description).toBe("string");
      });
    });
    describe("queries", () => {
      describe("property_type", () => {
        test("responds with status of 200 and an array of properties that match property type", async () => {
          const { body } = await request(app)
            .get("/api/properties?property_type=House")
            .expect(200);
          body.properties.forEach((property) => {
            expect(property.property_type).toBe("House");
          });
        });
        test("responds with status of 200 and an array of properties over minprice", async () => {
          const { body } = await request(app)
            .get("/api/properties?minprice=100")
            .expect(200);
          body.properties.forEach((property) => {
            const price = Number(property.price_per_night);
            expect(price).toBeGreaterThanOrEqual(100);
          });
        });
        test("responds with status of 200 and an array of properties under maxprice", async () => {
          const { body } = await request(app)
            .get("/api/properties?maxprice=100")
            .expect(200);
          body.properties.forEach((property) => {
            const price = Number(property.price_per_night);
            expect(price).toBeLessThanOrEqual(100);
          });
        });
        test("responds with status of 200 and an array of properties sorted by cost_per_night in ascending order", async () => {
          const { body } = await request(app)
            .get("/api/properties?sort=cost_per_night&order=ascending")
            .expect(200);

          const prices = body.properties.map((property) =>
            Number(property.price_per_night)
          );
          console.log(prices);
          expect(prices).toBeSorted({ ascending: true });
        });
        test("responds with status of 200 and an array of properties sorted by cost_per_night in descending order", async () => {
          const { body } = await request(app)
            .get("/api/properties?sort=cost_per_night&order=descending")
            .expect(200);

          const prices = body.properties.map((property) =>
            Number(property.price_per_night)
          );
          console.log(prices);
          expect(prices).toBeSorted({ descending: true });
        });
      });
    });
  });
  describe("GET - /api/properties/:id", () => {
    test("responds with status of 200", async () => {
      const testPropertyId = 1;
      const { body } = await request(app)
        .get(`/api/properties/${testPropertyId}`)
        .expect(200);
      expect(body.property.length).toBeGreaterThan(0);
      body.property.forEach((property) => {
        expect(typeof property.property_id).toBe("number");
        expect(typeof property.host_id).toBe("number");
        expect(typeof property.name).toBe("string");
        expect(typeof property.location).toBe("string");
        expect(typeof property.property_type).toBe("string");
        expect(typeof property.price_per_night).toBe("string");
        expect(typeof property.description).toBe("string");
      });
    });
  });
  describe("GET - /api/properties/:id/reviews", () => {
    test("responds with status of 200", async () => {
      const testPropertyId = 1;
      const { body } = await request(app)
        .get(`/api/properties/${testPropertyId}/reviews`)
        .expect(200);
      expect(body.reviews.length).toBeGreaterThan(0);
      body.reviews.forEach((review) => {
        expect(typeof review.review_id).toBe("number");
        expect(typeof review.property_id).toBe("number");
        expect(typeof review.guest_id).toBe("number");
        expect(typeof review.rating).toBe("number");
        expect(typeof review.comment).toBe("string");
        expect(typeof review.created_at).toBe("string");
      });
    });
  });
  describe("GET - /api/users/:id", () => {
    test("responds with status of 200", async () => {
      const testUserId = 1;
      const { body } = await request(app)
        .get(`/api/users/${testUserId}`)
        .expect(200);
      expect(body.user.length).toBeGreaterThan(0);
      body.user.forEach((user) => {
        expect(typeof user.user_id).toBe("number");
        expect(typeof user.first_name).toBe("string");
        expect(typeof user.surname).toBe("string");
        expect(typeof user.email).toBe("string");
        expect(typeof user.phone_number).toBe("string");
        expect(typeof user.is_host).toBe("boolean");
        expect(typeof user.avatar).toBe("string");
        expect(typeof user.created_at).toBe("string");
      });
    });
  });
});
