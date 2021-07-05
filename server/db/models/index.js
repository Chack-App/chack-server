const db = require('../index');
const Sequelize = require('sequelize');

const User = require('./users');

const Item = require('./items');

//associations

User.belongsToMany(Item, { through: 'userItem' });

Item.belongsToMany(User, { through: 'userItem' });

module.exports = {
  db,
  User,
  Item,
};
