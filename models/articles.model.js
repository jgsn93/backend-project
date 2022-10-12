const db = require("../db/connection");

exports.fetchArticles = (topic) => {
  if (topic) {
    return db
      .query(
        `SELECT articles.*, CAST (COUNT(comment_id) AS INT) AS comment_count 
      FROM articles 
      JOIN comments ON articles.article_id = comments.article_id WHERE topic = $1 GROUP BY articles.article_id ORDER BY article_id ASC;`,
        [topic]
      )
      .then((data) => {
        if (!data.rows.length) {
          return Promise.reject({ status: 404, message: "Article not found" });
        }
        data.rows.forEach((index) => {
          delete index.body; //Ticket send to remove this?
        });
        return data.rows;
      });
  } else {
    return db
      .query(
        `SELECT articles.*, CAST (COUNT(comment_id) AS INT) AS comment_count 
      FROM articles 
      JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY article_id ASC;`
      )
      .then((data) => {
        data.rows.forEach((index) => {
          delete index.body; //Ticket send to remove this?
        });
        return data.rows;
      });
  }
};

exports.fetchArticlesById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, CAST (COUNT(comment_id) AS INT) AS comment_count
        FROM articles
        JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`,
      [article_id]
    )
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
