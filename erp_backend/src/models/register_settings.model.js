module.exports = (sequelize, DataTypes) => {
  const RegisterSettings = sequelize.define("register_settings", {
    mode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "close", // either "open" or "close"
    },
  });

  return RegisterSettings;
};
