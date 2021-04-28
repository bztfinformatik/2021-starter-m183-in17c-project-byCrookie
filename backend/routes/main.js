const express = require("express");

const userCtrl = require("../controllers/user");
const postingCtrl = require("../controllers/posting");
const mainCtrl = require("../controllers/main");
const authorization = require("../middleware/authorization");

const router = express.Router();

// User
router.get("/users", authorization, userCtrl.getUsers);
router.post("/user", authorization, userCtrl.addUser);
router.get("/users/:ids", authorization, userCtrl.getUsers);
router.post("/user/login", userCtrl.login);

// Posting
router.post("/posting", authorization, postingCtrl.addPosting);
router.get("/postings", authorization, postingCtrl.getPostings);
router.get("/postings/:ids", authorization, postingCtrl.getPostings);
router.get("/postings/:id/postings", authorization, postingCtrl.getSubPostings);

// Main
router.get("/", mainCtrl.doNothing);

module.exports = router;
