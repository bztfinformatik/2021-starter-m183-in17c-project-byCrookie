const express = require("express");

const userCtrl = require("../controllers/user");
const postingCtrl = require("../controllers/posting");
const mainCtrl = require("../controllers/main");

const router = express.Router();

// User
router.get("/users", userCtrl.getUsers);
router.post("/user", userCtrl.addUser);
router.get("/users/:ids", userCtrl.getUsers);

// Posting
router.get("/postings", postingCtrl.getPostings);
router.get("/postings/:ids", postingCtrl.getPostings);

// Main
router.get("/", mainCtrl.doNothing);

module.exports = router;
