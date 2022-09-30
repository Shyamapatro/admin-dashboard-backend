module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("calender", {
		...require("./core")(Sequelize, DataTypes),
   title: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    start: {
        type: DataTypes.DATEONLY,
    },
    end: {
      type: DataTypes.DATEONLY,
  },

  },
  {
    freezeTableName: true,
    paranoid: true,
  }
);
}
