const { userLogin, profileUser } = require("../controllers/userController");
const express = require("express");

const router = express.Router();

router.route("/login").post(userLogin);
router.route("/profile/:id").get(profileUser);

module.exports = router;
