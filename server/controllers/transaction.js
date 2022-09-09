const { Transaction, sequelize, Category, User, Wallet } = require("../models");

class TransactionsController {
	static async updateTransaction(req, res, next) {
		const t = await sequelize.transaction();
		try {
			const { id } = req.params;
			const { name, amount, CategoryId, date } = req.body;
			const findTransactions = await Transaction.findByPk(id);
			if (!findTransactions) {
				throw { name: "TransactionsNotFound" };
			}
			const updateTransaction = await Transaction.update(
				{
					name,
					amount,
					date,
					CategoryId,
					UserId: findTransactions.UserId,
					WalletId: findTransactions.WalletId,
				},
				{
					where: {
						id,
					},
					transaction: t,
				}
			);
			await t.commit();
			res.status(200).json({
				message: "Succes Edit Transaction with Id " + id,
			});
		} catch (error) {
			await t.rollback();
			next(error);
		}
	}

	static async deleteTransaction(req, res, next) {
		try {
			const { id } = req.params;
			const findTransactions = await Transaction.findByPk(id);
			if (!findTransactions) {
				throw { name: "TransactionsNotFound" };
			}
			const deleteTransaction = await Transaction.destroy({
				where: {
					id,
				},
			});
			res.status(200).json({
				message: "Success delete Transaction with Id " + id,
			});
		} catch (error) {
			next(error);
		}
	}

	static async createTransaction(req, res, next) {
		try {
			const { name, amount, date, CategoryId, WalletId } = req.body;

			const { id: UserId } = req.user;
			const transaction = await Transaction.create({
				name,
				amount,
				date,
				UserId,
				CategoryId,
				WalletId,
			});
			res.status(201).json({
				message: "Success Create Data",
				transaction,
			});
		} catch (error) {
			console.log(error);
			next(error);
		}
	}

	static async getTransaction(req, res, next) {
		try {
			const transaction = await Transaction.findAll({ include: [Category, Wallet] });
			res.status(200).json({ transaction });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = TransactionsController;
