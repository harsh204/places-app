const express = require("express");
const { check } = require("express-validator");

const userControllers = require("../Controllers/user-controllers");
const imageUpload = require("../Middleware/image-upload");

const router = express.Router();

router.get("/", userControllers.getUsers);

router.post(
  "/signup",
  imageUpload.single("image"),
  [
    check("email").normalizeEmail().isEmail(),
    check("name").not().isEmpty(),
    check("password").isLength({ min: 8 }),
  ],
  userControllers.signUpUsers
);

router.post("/login", userControllers.loginUsers);

module.exports = router;
