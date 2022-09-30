//let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
  return sequelize.define(
    'users',
    {
      ...require('./core')(Sequelize, DataTypes),
      firstName: {
        type: DataTypes.STRING(150),
        defaultValue: null
      },
      lastName: {
        type: DataTypes.STRING(150),
        defaultValue: null
      },
      email: {
        type: DataTypes.STRING(150),
        defaultValue: null
      },
      password: {
        type: DataTypes.STRING(150),
        defaultValue: null
      },
      countryCode: {
        type: DataTypes.STRING(5),
        defaultValue: null
      },
      phoneNumber: {
        type: DataTypes.STRING(16),
        defaultValue: null
      },
      forgotPasswordToken: {
        type: DataTypes.STRING(150),
        defaultValue: null
      },
      passwordResetToken: {
        type: DataTypes.STRING(150),
        defaultValue: null
      },
      platformType: {
        type: DataTypes.ENUM,
        values: ["ANDROID", "IOS", "WEB"],
        defaultValue: null
      }
    },
    {
      tableName: 'users',
      timestamps: true,
      paranoid: true,
      deletedAt: 'destroyTime'
    }
  )
}
