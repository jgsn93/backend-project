const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const { getArticleById } = require("./controllers/articles.controller");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.use((req, res, next) => {
  res.status(404).send({ message: "Invalid end point" });
});

module.exports = app;
