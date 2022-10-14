const endpoints = require("../endpoints.json");

exports.getEndpoints = (req, res) => {
  res.send(endpoints);
};
