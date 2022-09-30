module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define(
		"SocialAccounts",
		{
			...require("./core")(Sequelize, DataTypes),
			userId: {
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
				references: {
					key: "id",
					model: "users"
				},
				type: Sequelize.UUID
			},
			loginType: {             // 1 => EMAIL_OR_PHONE,  2 => FACEBOOK, 3 => GMAIL, 4 => APPLE, 5 => MICROSOFT
				type: DataTypes.INTEGER,
				allowNull: true
			}
		},
		{ tableName: "SocialAccounts" }
	);
};
