const Sequelize = require("sequelize");
const { db } = require("../index");

const bcrypt = require("bcrypt");

const SALT_ROUNDS = 13;

const User = db.define("users", {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  password: {
    type: Sequelize.STRING,
  },
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
});

module.exports = User;

//instance methods
User.prototype.correctPassword = function (canidatePwd) {
  return bcrypt.compare(canidatePwd, this.password);
};

//class methods
const hashPassword = async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
  }
};

User.beforeCreate(hashPassword);
User.beforeUpdate(hashPassword);
User.beforeBulkCreate((users) => Promise.all(users.map(hashPassword)));
