const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../Models/http-error");
const getCoordsFromAddress = require("../Util/location");
const Place = require("../Models/place");
const User = require("../Models/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.placeId;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong! Cannot find place.",
      500
    );
    return next(error);
  }

  if (!place) {
    return next(
      new HttpError("No place could be found for the provided place id.", 404)
    );
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  let places;
  try {
    places = await Place.find({ creatorId: userId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong! Could not find places.",
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("No places could be found for the provided user id.", 404)
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs received. Please enter valid inputs and try again",
        422
      )
    );
  }

  const { title, description, address } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsFromAddress(address);
  } catch (error) {
    return next(error);
  }

  const newPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creatorId: req.userData.userId,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Cannot save place at the moment. Please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    return next(new HttpError("Could not find user for provided userId."));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newPlace.save({ session: sess });
    user.places.push(newPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Cannot save place at the moment. Please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: newPlace });
};

const updatePlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs received. Please enter valid inputs and try again",
        422
      )
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.placeId;

  let foundPlace;
  try {
    foundPlace = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Failed to update place. Please try again!",
      500
    );
    return next(error);
  }

  if (foundPlace.creatorId.toString() !== req.userData.userId) {
    return next(
      new HttpError("You are not authorized to make this request.", 401)
    );
  }

  foundPlace.title = title;
  foundPlace.description = description;

  try {
    await foundPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Failed to update place. Please try again!",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: foundPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.placeId;
  let place;
  try {
    place = await Place.findById(placeId).populate("creatorId");
  } catch (err) {
    const error = new HttpError(
      "Could not delete place. Please try again!",
      500
    );
    return next(error);
  }

  if (!place) {
    return next(
      new HttpError("Could not find place for the provided placeId.")
    );
  }

  if (place.creatorId.id !== req.userData.userId) {
    return next(
      new HttpError("You are not authorized to make this request.", 401)
    );
  }

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creatorId.places.pull(place);
    await place.creatorId.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Could not delete place. Please try again!",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Place Deleted" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
