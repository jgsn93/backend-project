const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticles,
  getArticleById,
  patchArticleById,
  postCommentByArticleId,
} = require("./controllers/articles.controller");
const { getUsers } = require("./controllers/users.controller");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id", patchArticleById);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

//404 for end points not found
app.all("*", (req, res) => {
  res.status(404).send({ message: "Invalid end point" });
});

//Handle PSQL errors
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ message: "Invalid input" });
  } else if (err.code === "23503") {
    res.status(404).send({ message: "Username not found" });
  } else {
    next(err);
  }
});

//Handle custom errors
app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else next(err);
});

//500 catch all
app.use((err, req, res, next) => {
  res.status(500).send({ message: "Server Error" });
});

module.exports = app;
