const express = require("express");
const { check } = require("express-validator");

const placeControllers = require("../Controllers/place-controllers");
const authentication = require("../Middleware/authentication");
const imageUpload = require("../Middleware/image-upload");

const router = express.Router();

router.get("/:placeId", placeControllers.getPlaceById);

router.get("/user/:userId", placeControllers.getPlacesByUserId);

router.use(authentication);

router.patch(
  "/:placeId",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placeControllers.updatePlace
);

router.delete("/:placeId", placeControllers.deletePlace);

router.post(
  "/",
  imageUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placeControllers.createPlace
);

module.exports = router;
