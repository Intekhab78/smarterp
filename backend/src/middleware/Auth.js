const jwt = require("jsonwebtoken");
const ResponseFormatter = require("../utils/ResponseFormatter");
const db = require("../models");

module.exports = async (req, res, next) => {
  try {
    const SECRET = "secreatnoteforfestivalapp";
    const usertoken = req.headers.authorization;
    const token = usertoken;
    const decoded = await jwt.verify(token, SECRET);

    const userId = decoded.userId;
    const type = decoded.type;

    let user;

    if (type === "User" || type === 2) {
      user = await db.user_master.findByPk(userId); // ✅ for normal users
    } else {
      user = await db.user_master.findByPk(userId); // ✅ for admin users
    }

    if (!user) {
      return res
        .status(401)
        .json(
          ResponseFormatter.setResponse(
            false,
            401,
            "User not found!",
            "Error",
            ""
          )
        );
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json(
        ResponseFormatter.setResponse(false, 401, error.message, "Error", "")
      );
  }
};
