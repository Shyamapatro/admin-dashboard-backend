module.exports = function (Sequelize, sequelize, DataTypes) {
  return sequelize.define(
    "notification",
    {
      ...require("./core")(Sequelize, DataTypes),
      Title: {
        type: DataTypes.STRING,
        defaultValue: "No Title",
      },
      message: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
};

