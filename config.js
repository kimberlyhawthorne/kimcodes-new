var config = {};

config.port = process.env.PORT || 8080;

// database information
config.dbUri = "mongodb://heroku_51zmrzns:5ucasqv0vq68enlbk6mgrl86im@ds041516.mlab.com:41516/heroku_51zmrzns";

module.exports = config;