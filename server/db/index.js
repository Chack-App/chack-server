const Sequelize = require("sequelize");

const db = require("./db");
const User = require("./models/users");
const Event = require("./models/events");


const Item = require('./items');

//associations

User.belongsToMany(Item, { through: 'userItem' });

Item.belongsToMany(User, { through: 'userItem' });
User.belongsToMany(Event, {through: 'user_event'})
Event.belongsToMany(User, {through: 'user_event'})

module.exports = {
  db,
  User,
  Event,
  Item
};
