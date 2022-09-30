module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("reportContent", {
		...require("./core")(Sequelize, DataTypes),

    reportedItem: {
      type: DataTypes.STRING(120),
      defaultValue: null,
    },
    status: {
      type:DataTypes.ENUM("pending", "approved", "declined"),
    defaultValue: "pending",
    },
    reportedBy: {
      type: DataTypes.STRING(120),
    },
    Description:
    {
        type: DataTypes.STRING,
        defaultValue: null,
      },
  },
  {
    tableName: "reportContent",
    timestamps: true,
    paranoid: true,
   
  }
);
}