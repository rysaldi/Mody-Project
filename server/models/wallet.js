"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Wallet extends Model {
		static associate(models) {
			Wallet.hasMany(models.Transaction, { foreignKey: "WalletId" });
			Wallet.hasMany(models.UserWallet, { foreignKey: "WalletId" });
		}
	}
	Wallet.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: {
						msg: "Wallet name is required",
					},
					notNull: {
						msg: "Wallet name is required",
					},
				},
			},
			balance: {
				type: DataTypes.INTEGER,
			},
		},
		{
			sequelize,
			modelName: "Wallet",
		}
	);
	Wallet.beforeCreate((wallet, options) => {
		wallet.balance = 0;
	});
	return Wallet;
};
