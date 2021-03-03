const express = require("express");

const userCtrl = require("../controllers/user");
const postingCtrl = require("../controllers/posting");
const mainCtrl = require("../controllers/main");

const router = express.Router();

// User
router.get("/users", userCtrl.getUsers);
router.post("/user", userCtrl.addUser);
router.get("/users/:ids", userCtrl.getUsers);

// Main
router.get("/", mainCtrl.doNothing);

module.exports = router;
