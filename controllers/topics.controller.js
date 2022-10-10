const { fetchTopics } = require("../models/topics.model");

exports.getTopics = (req, res) => {
  fetchTopics().then((body) => {
    res.status(200).send(body);
  });
};
