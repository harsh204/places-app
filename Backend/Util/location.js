const axios = require("axios");

const HttpError = require("../Models/http-error");

const API_KEY = process.env.API_KEY;

async function getCoordinatesFromAddress(address) {
  const response = await axios(
    `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
      address
    )}.json?key=${API_KEY}`
  );

  const responseData = response.data;

  if (responseData.error) {
    return next(
      new HttpError(
        "Could not find the location for the specified address",
        422
      )
    );
  }

  const location = responseData.results[0].position;

  const coordinates = {
    lng: location.lon,
    lat: location.lat,
  };

  return coordinates;
}

module.exports = getCoordinatesFromAddress;
