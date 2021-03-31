const User = require("../models/user");
const helper = require("../util/helper");
const consts = require("../util/const");
const logger = require("../util/log");

exports.getUsers = async (req, res, next) => {
  try {
    let result = new Array(0);
    if (helper.isEmpty(req.query)) {
      result = await User.getByIds(req.params.ids);
    } else {
      try {
        result = await User.filter(req.query);
      } catch (err) {
        if (err.errno != consts.ERR_DB_UNKONW_COLUMN) {
          throw err;
        }
      }
    }
    res.status(200).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const result = await User.add(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.getByUsername(req.body.username);
    logger.debug(user);
    if (user && (await helper.compare_hash(req.body.pwd, user.pwd))) {
      res.status(200).json(user);
    } else {
      next({ statusCode: 401, message: "Authentication failed." });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
