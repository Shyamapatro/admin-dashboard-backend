module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("adminAchivement_level_table", {
		...require("./core")(Sequelize, DataTypes),
achievementId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: "adminAchivement_table",
        key: "id",
      },
    },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
     Type:{
        type:DataTypes.STRING
     }
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  
} 