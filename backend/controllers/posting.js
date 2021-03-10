const Posting = require("../models/posting");
const helper = require("../util/helper");
const consts = require("../util/const");

exports.getPostings = async (req, res, next) => {
  try {
    let result = new Array(0);
    if (helper.isEmpty(req.query)) {
      result = await Posting.getByIds(req.params.ids);
    } else {
      try {
        result = await Posting.filter(req.query);
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

exports.addPosting = async (req, res, next) => {
  try {
    const result = await Posting.add(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
