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

describe("GET /api/articles", () => {
  test("200: returns an object with an array with correctly formatted objects sorted by article ID in ascending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(5);
        expect(articles[0].article_id).toBe(1);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("200: returns an object with an array with correctly formatted objects filtered by topic sorted by article ID in ascending order", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(4);
        expect(articles[0].article_id).toBe(1);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("404: returns an error if a request query is for a topic that does not exist", () => {
    return request(app)
      .get("/api/articles?topic=durian")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Topic not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: return an article object with the correct properties", () => {
    return request(app)
      .get(`/api/articles/1`)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          comment_count: 11,
        });
      });
  });

  test("404: returns an error if ID does not exist but correct input type", () => {
    return request(app)
      .get(`/api/articles/9000`)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article not found");
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

describe("GET /api/users", () => {
  test("200: returns an object with an array with correctly formatted objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: accepts a valid object to patch and responds with the updated article ", () => {
    const patchedObj = { inc_votes: 50 };

    return request(app)
      .patch("/api/articles/1")
      .send(patchedObj)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 150,
        });
      });
  });
  test("400: returns an err if the patch request does not have an inc_votes key", () => {
    const patchedObj = { do_not_want: 100 };

    return request(app)
      .patch("/api/articles/1")
      .send(patchedObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Must have an inc_votes key");
      });
  });
  test("400: returns an error if the patch request has an invalid id type ", () => {
    const patchedObj = { inc_votes: 50 };

    return request(app)
      .patch("/api/articles/durianlove")
      .send(patchedObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid input");
      });
  });
  test("404: returns an error if ID does not exist but correct input type", () => {
    const patchedObj = { inc_votes: 50 };

    return request(app)
      .patch("/api/articles/9876")
      .send(patchedObj)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article not found");
      });
  });
  test("400: returns an error if the patch request has an invalid value data type", () => {
    const patchedObj = { inc_votes: "break" };

    return request(app)
      .patch("/api/articles/1")
      .send(patchedObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid input");
      });
  });
});

describe.only("POST /api/articles/:article_id/comments", () => {
  test("201: accepts a valid object and responds with the posted comment", () => {
    const postedObj = {
      username: "butter_bridge",
      body: "this api is coming along pretty sweet",
    };

    return request(app)
      .post("/api/articles/9/comments")
      .send(postedObj)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual({
          comment_id: 19,
          body: "this api is coming along pretty sweet",
          article_id: 9,
          author: "butter_bridge",
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
  test("201: accepts object as long as it has a username and body properties, ignoring other properties", () => {
    const postedObj = {
      username: "butter_bridge",
      body: "this api is coming along pretty sweet",
      random: "just ignore me",
    };

    return request(app)
      .post("/api/articles/9/comments")
      .send(postedObj)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual({
          comment_id: 19,
          body: "this api is coming along pretty sweet",
          article_id: 9,
          author: "butter_bridge",
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
  test("400: returns an error if object is missing either a body or username", () => {
    const postedObj = {
      body: "this api is coming along pretty sweet",
    };

    return request(app)
      .post("/api/articles/9/comments")
      .send(postedObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  test("400: returns an error if the id is an invalid type", () => {
    const postedObj = {
      username: "butter_bridge",
      body: "git pull requests make me cry a bit",
    };

    return request(app)
      .post("/api/articles/hellothere/comments")
      .send(postedObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid input");
      });
  });
  test("404: returns an error if the username is not stored in users", () => {
    const postedObj = {
      username: "intruder",
      body: "this api is coming along pretty sweet",
    };

    return request(app)
      .post("/api/articles/9/comments")
      .send(postedObj)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Username not found");
      });
  });
  test("404: returns an error if the id is valid type but does not exist", () => {
    const postedObj = {
      username: "intruder",
      body: "this api is coming along pretty sweet",
    };

    return request(app)
      .post("/api/articles/9000/comments")
      .send(postedObj)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Username not found");
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
