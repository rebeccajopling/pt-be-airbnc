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
        // errors
        test("responds with status of 400 and error message of 'Bad Request' for invalid property type", async () => {
          const { body } = await request(app)
            .get("/api/properties?property_type=999")
            .expect(400);
          expect(body.msg).toBe("Bad Request");
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
        // errors
        test("responds with status of 400 and error message of 'Bad Request' for invalid minprice", async () => {
          const { body } = await request(app)
            .get("/api/properties?minprice=abc")
            .expect(400);
          expect(body.msg).toBe("Bad Request");
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
        // errors
        test("responds with status of 400 and error message of 'Bad Request' for invalid maxprice", async () => {
          const { body } = await request(app)
            .get("/api/properties?maxprice=abc")
            .expect(400);
          expect(body.msg).toBe("Bad Request");
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
        test("responds with status of 400 and error message of 'Bad Request' for invalid sort query", async () => {
          const { body } = await request(app)
            .get("/api/properties?sort=invalid_sort_key")
            .expect(400);
          expect(body.msg).toBe("Bad Request");
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

      expect(body.property).toEqual({
        property_id: 1,
        host_id: 1,
        name: "Modern Apartment in City Center",
        location: "London, UK",
        property_type: "Apartment",
        price_per_night: "120",
        description: "Description of Modern Apartment in City Center.",
      });
    });
    // errors
    test("responds with status of 400 and error message of 'Bad Request' for invalid property_id", async () => {
      const { body } = await request(app)
        .get("/api/properties/invalid-id")
        .expect(400);
      expect(body.msg).toBe("Bad Request");
    });
    test("responds with status of 404 and error message of 'Property Not Found' when property does not exist", async () => {
      const { body } = await request(app)
        .get("/api/properties/999")
        .expect(404);
      expect(body.msg).toBe("Property Not Found");
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
    // errors
    test("responds with status of 400 and error message of 'Bad Request' for invalid property_id", async () => {
      const { body } = await request(app)
        .get("/api/properties/invalid-id/reviews")
        .expect(400);
      expect(body.msg).toBe("Bad Request");
    });
    test("responds with status of 404 and error message of 'Property Not Found' when property does not exist", async () => {
      const { body } = await request(app)
        .get("/api/properties/999/reviews")
        .expect(404);
      expect(body.msg).toBe("Property Not Found");
    });
  });

  describe("GET - /api/users/:id", () => {
    test("responds with status of 200", async () => {
      const testUserId = 1;
      const { body } = await request(app)
        .get(`/api/users/${testUserId}`)
        .expect(200);

      expect(body.user).toEqual({
        user_id: 1,
        first_name: "Alice",
        surname: "Johnson",
        email: "alice@example.com",
        phone_number: "+44 7000 111111",
        is_host: true,
        avatar: "https://example.com/images/alice.jpg",
        created_at: expect.any(String),
      });
    });
    // errors
    test("responds with status of 400 and error message of 'Bad Request' for invalid user_id", async () => {
      const { body } = await request(app)
        .get("/api/users/invalid-id")
        .expect(400);
      expect(body.msg).toBe("Bad Request");
    });
    test("responds with status of 404 and error message of 'User Not Found' when user does not exist", async () => {
      const { body } = await request(app).get("/api/users/999").expect(404);
      expect(body.msg).toBe("User Not Found");
    });
  });

  describe("POST - /api/properties/:id/reviews", () => {
    test("responds with status of 201 and creates new property review", async () => {
      const propertyId = 2;
      const newReview = {
        guest_id: 2,
        rating: 5,
        comment: "Amazing stay!",
      };

      const { body } = await request(app)
        .post(`/api/properties/${propertyId}/reviews`)
        .send(newReview)
        .expect(201);

      expect(body.review).toEqual({
        review_id: expect.any(Number),
        property_id: propertyId,
        guest_id: newReview.guest_id,
        rating: newReview.rating,
        comment: newReview.comment,
        created_at: expect.any(String),
      });
    });
    // errors
    test("responds with status of 400 and error message 'Bad Request' when required fields are missing", async () => {
      const propertyId = 2;
      const invalidReview = {};

      const { body } = await request(app)
        .post(`/api/properties/${propertyId}/reviews`)
        .send(invalidReview)
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    });
    test("responds with status of 400 and error message 'Bad Request' when required fields are missing", async () => {
      const propertyId = 2;
      const invalidReview = {
        rating: 5,
        comment: "Amazing stay!",
      };

      const { body } = await request(app)
        .post(`/api/properties/${propertyId}/reviews`)
        .send(invalidReview)
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    });
    test("responds with status of 400 and error message 'Bad Request' for invalid guest_id", async () => {
      const propertyId = 2;
      const invalidReview = {
        guest_id: "invalid_id",
        rating: 5,
        comment: "Amazing stay!",
      };

      const { body } = await request(app)
        .post(`/api/properties/${propertyId}/reviews`)
        .send(invalidReview)
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    });
    test("responds with status of 400 and error message 'Bad Request' for invalid rating", async () => {
      const propertyId = 2;
      const invalidReview = {
        guest_id: 2,
        rating: "invalig_rating",
        comment: "Amazing stay!",
      };

      const { body } = await request(app)
        .post(`/api/properties/${propertyId}/reviews`)
        .send(invalidReview)
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    });
    test("responds with status of 400 and error message 'Bad Request' for invalid comment", async () => {
      const propertyId = 2;
      const invalidReview = {
        guest_id: 2,
        rating: 5,
        comment: 12345,
      };

      const { body } = await request(app)
        .post(`/api/properties/${propertyId}/reviews`)
        .send(invalidReview)
        .expect(400);

      expect(body.msg).toBe("Bad Request");
    });
    test("responds with status of 404 and error message 'Property Not Found' when property does not exist", async () => {
      const propertyId = 999;
      const newReview = {
        guest_id: 2,
        rating: 5,
        comment: "Amazing stay!",
      };

      const { body } = await request(app)
        .post(`/api/properties/${propertyId}/reviews`)
        .send(newReview)
        .expect(404);

      expect(body.msg).toBe("Property Not Found");
    });
    test("responds with status of 404 and error message 'User Not Found' when guest_id does not exist", async () => {
      const propertyId = 1;
      const newReview = {
        guest_id: 999,
        rating: 5,
        comment: "Amazing stay!",
      };

      const { body } = await request(app)
        .post(`/api/properties/${propertyId}/reviews`)
        .send(newReview)
        .expect(404);

      expect(body.msg).toBe("User Not Found");
    });
  });

  describe("DELETE - /api/reviews/:id", () => {
    test("responds with status of 204 and deletes the review", async () => {
      const propertyId = 2;
      const newReview = {
        guest_id: 2,
        rating: 5,
        comment: "Test review for deletion",
      };

      const postResponse = await request(app)
        .post(`/api/properties/${propertyId}/reviews`)
        .send(newReview)
        .expect(201);

      const reviewId = postResponse.body.review.review_id;

      await request(app).delete(`/api/reviews/${reviewId}`).expect(204);
      await request(app).delete(`/api/reviews/${reviewId}`).expect(404);
    });
    // errors
    test("responds with status of 400 and error message 'Bad Request' for invalid review_id", async () => {
      const response = await request(app)
        .delete("/api/reviews/invalid-id")
        .expect(400);
      expect(response.body.msg).toBe("Bad Request");
    });
    test("responds with status of 404 and error message 'Review Not Found' when review_id does not exist", async () => {
      const response = await request(app)
        .delete("/api/reviews/999")
        .expect(404);
      expect(response.body.msg).toBe("Review Not Found");
    });
  });
});
