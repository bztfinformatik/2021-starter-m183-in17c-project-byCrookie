const jsonwebtoken = require("jsonwebtoken");
const logger = require("../util/log");

module.exports = {
  sign(payload) {
    var token = jsonwebtoken.sign(payload, process.env.JWT_SECRET, { expiresIn: "1.5h" });
    logger.debug(token);
    return token;
  },

  decode(req) {
    var decoded = jsonwebtoken.decode(
      req.headers.authorization.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    logger.debug(decoded);
    return decoded;
  }
};
