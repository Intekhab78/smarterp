"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

// 🔑 use config.js instead of config.json
const config = require(__dirname + "/../config/config.js")[env];

const db = {};
let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ✅ 1. Load core models
const baseModelsPath = __dirname;

fs.readdirSync(baseModelsPath)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(baseModelsPath, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// ✅ 2. Load Trip models
const tripModelsPath = path.join(__dirname, "../Trip/models");

fs.readdirSync(tripModelsPath)
  .filter((file) => file.endsWith(".js"))
  .forEach((file) => {
    const model = require(path.join(tripModelsPath, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// ✅ 3. Run associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
