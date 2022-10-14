const db = require("../db/connection");

exports.fetchArticles = (topic, sort_by = "created_at", order = "desc") => {
  let mainQuery = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, CAST (COUNT(comment_id) AS INT) AS comment_count 
  FROM articles 
  JOIN comments ON articles.article_id = comments.article_id`;

  const topicQuery = ` WHERE topic = $1`;
  const groupByQuery = ` GROUP BY articles.article_id`;
  const orderSortByQuery = ` ORDER BY ${sort_by} ${order}`;

  const validSortQueries = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];

  const validOrderQueries = ["asc", "desc"];

  if (
    !validSortQueries.includes(sort_by) ||
    !validOrderQueries.includes(order)
  ) {
    return Promise.reject({ status: 400, message: "Invalid query" });
  }

  if (!topic) {
    return db
      .query(`${mainQuery} ${groupByQuery} ${orderSortByQuery};`)
      .then((response) => {
        return response.rows;
      });
  }

  if (topic) {
    const query1 = db.query(
      `${mainQuery} ${topicQuery} ${groupByQuery} ${orderSortByQuery};`,
      [topic]
    );
    const query2 = db.query(`SELECT * FROM articles WHERE topic = $1;`, [
      topic,
    ]);

    return Promise.all([query1, query2]).then((response) => {
      const articlesByTopic = response[0].rows;
      const doesTopicExist = response[1].rows;

      if (articlesByTopic.length !== 0 || doesTopicExist.length !== 0) {
        return articlesByTopic;
      } else {
        return Promise.reject({
          status: 404,
          message: "Topic not found",
        });
      }
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

exports.fetchCommentsByArticleId = (article_id) => {
  const query1 = db.query(
    `SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
    [article_id]
  );

  const query2 = db.query(`SELECT * FROM articles WHERE article_id = $1`, [
    article_id,
  ]);

  return Promise.all([query1, query2]).then((response) => {
    if (response[0].rows.length !== 0 || response[1].rows.length !== 0) {
      return response[0].rows;
    } else {
      return Promise.reject({
        status: 404,
        message: "No articles found with this ID",
      });
    }
  });
};
