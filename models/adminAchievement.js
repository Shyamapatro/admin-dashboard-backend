module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("adminAchievement_table", {
		...require("./core")(Sequelize, DataTypes),
    
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