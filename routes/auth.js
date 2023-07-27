const express = require("express");

const router = express.Router();

const AuthController = require("../controllers/AuthControllers");

router.post("/register", AuthController.register);
router.post("/register/verify", AuthController.verifyOtp);

module.exports = router;
