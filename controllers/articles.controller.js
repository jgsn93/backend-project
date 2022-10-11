const {
  fetchArticlesById,
  updateArticleById,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticlesById(article_id)
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
    res.status(404).send({ status: 404, message: "Invalid patch request" });
  }

  updateArticleById(inc_votes, article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
