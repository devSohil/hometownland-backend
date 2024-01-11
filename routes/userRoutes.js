const { userLogin } = require("../controllers/userController");
const express = require("express");

const router = express.Router();

router.route("/login").post(userLogin);

module.exports = router;
