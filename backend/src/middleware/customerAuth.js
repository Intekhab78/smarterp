const jwt = require("jsonwebtoken");
const ResponseFormatter = require("../utils/ResponseFormatter");
const db = require("../models");

module.exports = async (req, res, next) => {
  try {
    const SECRET = process.env.JWT_SECRET || "secreatnoteforfestivalapp";

    // ✅ declare token FIRST
    let token = null;

    console.log("Auth Header:", req.headers.authorization);
    console.log("Cookies:", req.cookies);

    // 1️⃣ From Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ From cookie (MATCH THIS NAME WITH LOGIN)
    if (!token && req.cookies?.customer_token) {
      token = req.cookies.customer_token;
    }

    console.log("Using Token:", token);

    // 3️⃣ Token missing
    if (!token) {
      return res
        .status(401)
        .json(
          ResponseFormatter.setResponse(
            false,
            401,
            "Unauthorized: Token missing",
            "Error",
            ""
          )
        );
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, SECRET);

    if (!decoded?.customer_id) {
      return res
        .status(401)
        .json(
          ResponseFormatter.setResponse(
            false,
            401,
            "Unauthorized: Invalid token payload",
            "Error",
            ""
          )
        );
    }

    // 5️⃣ Fetch customer
    const customer = await db.customer_master.findByPk(decoded.customer_id);

    if (!customer) {
      return res
        .status(401)
        .json(
          ResponseFormatter.setResponse(
            false,
            401,
            "User not found",
            "Error",
            ""
          )
        );
    }

    req.customer = customer;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res
      .status(401)
      .json(
        ResponseFormatter.setResponse(
          false,
          401,
          "Invalid or expired token",
          "Error",
          ""
        )
      );
  }
};
