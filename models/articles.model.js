const db = require("../db/connection");

exports.fetchArticlesById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, message: "Invalid article ID" });
      } else {
        return result.rows[0];
      }
    });
};
