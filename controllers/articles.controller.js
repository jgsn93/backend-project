const {
  fetchArticlesById,
  updateArticleById,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { comment_count } = req.query;

  fetchArticlesById(article_id, comment_count)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  if (!inc_votes) {
    res.status(400).send({ status: 400, message: "Invalid input" });
  }

  updateArticleById(inc_votes, article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
