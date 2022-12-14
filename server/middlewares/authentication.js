const { User } = require("../models");
const { verifyToken } = require("../helpers/jwt");

const authentication = async (request, response, next) => {
  try {
    const { access_token } = request.headers;
    // check if token exist
    if (!access_token) {
      throw { name: "Unauthorized" };
    }
    const payload = verifyToken(access_token);
    const { id } = payload;
    const currentUser = await User.findByPk(id);
    // check if token valid
    if (!payload && !currentUser) {
      throw { name: "Unauthorized" };
    }
    // assign user id to request
    request.user = {
      id: currentUser.id,
    };

    next();
  } catch (error) {
    next(error);
  }

};

module.exports = { authentication };
