const db = require('../index');
const Sequelize = require('sequelize');

const User = require('./users');

const Item = require('./items');

//associations

module.exports = {
  db,
  User,
  Item,
};
