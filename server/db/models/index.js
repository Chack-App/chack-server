const db = require("../index");
const Sequelize = require("sequelize");

const User = require("./users");

//associations

module.exports = {
  db,
  User,
};
