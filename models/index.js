var Sequelize = require("sequelize");
var sequelize = require("../dbConnection").sequelize;
module.exports = {
  category: require("./category")(Sequelize, sequelize, Sequelize.DataTypes),
  notification: require("./notification")(Sequelize, sequelize, Sequelize.DataTypes),
  admin: require("./admin")(Sequelize, sequelize, Sequelize.DataTypes),
  adminPermission: require("./adminPermission")(Sequelize, sequelize, Sequelize.DataTypes),
  adminSession: require("./adminSession")(Sequelize, sequelize, Sequelize.DataTypes),
  version: require("./version")(Sequelize, sequelize, Sequelize.DataTypes),
  adminAchievement: require("./adminAchievement")(Sequelize, sequelize, Sequelize.DataTypes),
  reportedBug: require("./reportedBug")(Sequelize, sequelize, Sequelize.DataTypes),
  reportContent: require("./reportContent")(Sequelize, sequelize, Sequelize.DataTypes),
  adminAchivementLevel: require("./adminAchivementLevel")(Sequelize, sequelize, Sequelize.DataTypes),
  socialAccounts: require("./socialAccounts")(Sequelize, sequelize, Sequelize.DataTypes),
  users: require("./users")(Sequelize, sequelize, Sequelize.DataTypes),
  session: require("./session")(Sequelize, sequelize, Sequelize.DataTypes),
  calender: require("./Calender")(Sequelize, sequelize, Sequelize.DataTypes),
  
};
