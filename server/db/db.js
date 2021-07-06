const Sequelize = require("sequelize");

const databaseName = "chack";

const config = {
  logging: false,
};

if (process.env.DATABASE_URL && !process.env.DEV_ENV) {
  config.dialectOptions = {
    logging: false,
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`,
  config
);

module.exports = db;
