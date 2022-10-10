const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const app = require("../app");

beforeEach(() => seed(testData));

afterAll(() => {
  db.end();
});

describe("GET /api/topics", () => {
  test("200: returns an object with an array with correctly formatted objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: return an article object with the correct properties", () => {
    const article_id = 1;

    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          author: expect.any(String),
          title: expect.any(String),
          article_id: article_id,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("404: returns an error if ID does not exist but correct input type", () => {
    return request(app)
      .get(`/api/articles/9000`)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid article ID");
      });
  });
  test("400: returns an error if not a valid input type", () => {
    return request(app)
      .get(`/api/articles/durian`)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid input");
      });
  });
});

describe("404 for invalid end points", () => {
  test("404: returns status 404 and error message for an invalid end point", () => {
    return request(app)
      .get("/api/nothing")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid end point");
      });
  });
});
