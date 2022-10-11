const db = require("../db/connection");

exports.fetchArticlesById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, message: "Article not found" });
      } else {
        return result.rows[0];
      }
    });
};

exports.updateArticleById = (inc_votes, article_id) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, article_id]
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, message: "Article not found" });
      } else {
        return result.rows[0];
      }
    });
};
