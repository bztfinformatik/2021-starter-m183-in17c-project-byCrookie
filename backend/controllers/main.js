const token = require("jsonwebtoken");

exports.doNothing = (req, res, next) => {
  res.status(200).json({ message: "Welcome" });
};
