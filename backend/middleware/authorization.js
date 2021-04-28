const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        return res.status(401).send("Token not valid. Please try login again.");
      }
      next();
    });
  } else {
    res.status(401).send("Token not found. Please try to login again.");
  }
};
