const Sequelize = require("sequelize")
const db = require("../db")
const jwt = require("jsonwebtoken")
const devJWT = require("../../../secrets")
const JWT = process.env.JWT || devJWT;

const bcrypt = require("bcrypt")

const SALT_ROUNDS = 13

const User = db.define("users", {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  password: {
    type: Sequelize.STRING
  },
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  payPalMe: {
    type: Sequelize.STRING
  }
})

module.exports = User

//instance methods
User.prototype.correctPassword = function (canidatePwd) {
  return bcrypt.compare(canidatePwd, this.password)
}

User.prototype.generateToken = function () {
  return jwt.sign({ id: this.id }, JWT)
}

//class methods
User.authenticate = async function ({ email, password }) {
  const user = await this.findOne({ where: { email } })
  if (!user || !(await user.correctPassword(password))) {
    const error = Error("Incorrect username / password")
    error.status = 401
    throw error
  }
  return user.generateToken()
}

User.findByToken = async function (token) {
  try {
    const { id } = await jwt.verify(token, JWT)
    const user = User.findByPk(id)
    if (!user) {
      throw new Error("No User Found")
    }
    return user
  } catch (err) {
    const error = Error("bad token")
    error.status = 401
    throw error
  }
}

const hashPassword = async user => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS)
  }
}

User.beforeCreate(hashPassword)
User.beforeUpdate(hashPassword)
User.beforeBulkCreate(users => Promise.all(users.map(hashPassword)))
