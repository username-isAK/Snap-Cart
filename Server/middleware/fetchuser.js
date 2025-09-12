const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "Access denied, token missing" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user; 
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = fetchuser;
