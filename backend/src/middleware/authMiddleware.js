import jwt from "jsonwebtoken";

import User from "../models/userModel.js";

const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } else {
      res.status(401);

      throw new Error("Not authorized");
    }
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

export default protect;
