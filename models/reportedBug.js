module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("reportBug", {
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
  },
  {
    tableName: "reportBug",
    timestamps: true,
    paranoid: true,
    deletedAt: 'destroyTime'
  }
);
}