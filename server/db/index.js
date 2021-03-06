// eslint-disable-next-line no-unused-vars
const Sequelize = require("sequelize")

const db = require("./db")
const User = require("./models/users")
const Event = require("./models/events")
const Item = require("./models/items")
const Receipt = require("./models/receipts")

//associations

User.belongsToMany(Item, { through: "userItem" })
Item.belongsToMany(User, { through: "userItem" })

User.belongsToMany(Event, { through: "user_event" })
Event.belongsToMany(User, { through: "user_event" })

Event.hasMany(Receipt)
Receipt.belongsTo(Event)

Receipt.hasMany(Item)
Item.belongsTo(Receipt)

module.exports = {
  db,
  User,
  Event,
  Item,
  Receipt
}
