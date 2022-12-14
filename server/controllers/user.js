const { comparePassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
const {
  User,
  Profile,
  Transaction,
  Wallet,
  Category,
  UserWallet,
} = require("../models");

class userController {
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const payload = {
        username,
        email,
        password,
      };
      const createUser = await User.create(payload);

      await Profile.create({
        UserId: createUser.id,
      });

      res.status(201).json({
        message: "Success create user",
        user: createUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async findAllUser(req, res, next) {
    try {
      const users = await User.findAll({
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      });

      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  static async findById(req, res, next) {
    try {
      const { id } = req.user;
      const findUser = await User.findByPk(id, {
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
        include: [
          {
            model: Transaction,
            attributes: ["id", "name", "amount", "date"],
            include: [
              {
                model: Category,
                attributes: ["name", "type"],
              },
            ],
          },
          {
            model: UserWallet,
            attributes: ["id", "WalletId", "role"],
            include: {
              model: Wallet,
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          },
          {
            model: Profile,
          },
        ],
        order: [[Transaction, "createdAt", "DESC"]],
      });
      res.status(200).json(findUser);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      // validation user input
      if (!email || !password) {
        throw { name: "Invalid input" };
      }
      const user = await User.findOne({
        where: {
          email,
        },
      });
      // check if user exist
      if (user) {
        const isPasswordValid = comparePassword(password, user.password);
        // check if password valid
        if (!isPasswordValid) {
          throw { name: "invalid email/password" };
        }
        // create payload and assign user id
        const payload = {
          id: user.id,
        };
        const access_token = createToken(payload);
        res.status(200).json({
          access_token,
        });
      } else {
        throw { name: "invalid email/password" };
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = userController;
