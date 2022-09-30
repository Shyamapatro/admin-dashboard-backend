module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("category", {
		...require("./core")(Sequelize, DataTypes),
   name: {
      type: DataTypes.STRING,
      allowNull: false,
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
}
