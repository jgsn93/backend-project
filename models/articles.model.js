const db = require("../db/connection");

exports.fetchArticles = (topic) => {
  if (topic) {
    return db
      .query(
        `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, CAST (COUNT(comment_id) AS INT) AS comment_count 
      FROM articles 
      JOIN comments ON articles.article_id = comments.article_id WHERE topic = $1 GROUP BY articles.article_id ORDER BY article_id ASC;`,
        [topic]
      )
      .then((data) => {
        return db
          .query(`SELECT EXISTS (SELECT 1 FROM articles WHERE topic = $1)`, [
            topic,
          ])
          .then((response) => {
            if (response.rows[0].exists === true) {
              return data.rows;
            } else {
              return Promise.reject({
                status: 404,
                message: "Topic not found",
              });
            }
          });
      });
  } else {
    return db
      .query(
        `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, CAST (COUNT(comment_id) AS INT) AS comment_count 
      FROM articles 
      JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY article_id ASC;`
      )
      .then((data) => {
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

exports.createCommentByArticleId = (article_id, postComment) => {
  const { username, body } = postComment;

  return db
    .query(
      `INSERT into comments (article_id, body, author)
      VALUES ($1, $2, $3)
      RETURNING *;`,
      [article_id, body, username]
    )
    .then((result) => {
      return result.rows[0];
    });
};
