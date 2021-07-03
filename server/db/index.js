const Sequelize = require("sequelize");

const db = require("./db");
const User = require("./models/users");
const Event = require("./models/events");

//associations

User.belongsToMany(Event, {through: 'user_event'})
Event.belongsToMany(User, {through: 'user_event'})

module.exports = {
  db,
  User,
  Event
};
