const {
  fetchAllProperties,
  fetchPropertyReviews,
  fetchUsers,
  fetchPropertyById,
  addPropertyReview,
  deleteReviewById,
} = require("../models/properties.models");

exports.getAllProperties = async (req, res, next) => {
  const { property_type, minprice, maxprice, sort, order } = req.query;
  try {
    const properties = await fetchAllProperties(
      property_type,
      minprice,
      maxprice,
      sort,
      order
    );
    return res.status(200).send({ properties });
  } catch (err) {
    next(err);
  }
};

exports.getPropertyById = async (req, res, next) => {
  const { id: property_id } = req.params;
  try {
    const property = await fetchPropertyById(property_id);
    res.status(200).send({ property });
  } catch (err) {
    next(err);
  }
};

exports.getPropertyReviews = async (req, res, next) => {
  const { id: property_id } = req.params;
  try {
    await fetchPropertyById(property_id);
    const reviews = await fetchPropertyReviews(property_id);
    return res.status(200).send({ reviews });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  const { id: user_id } = req.params;
  try {
    const user = await fetchUsers(user_id);
    return res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.postPropertyReview = async (req, res, next) => {
  const { id: property_id } = req.params;
  const { guest_id, rating, comment } = req.body;

  if (
    !guest_id ||
    typeof guest_id !== "number" ||
    !rating ||
    typeof rating !== "number" ||
    !comment ||
    typeof comment !== "string"
  ) {
    const err = new Error("Bad Request");
    err.code = "22P02";
    return next(err);
  }

  try {
    const newReview = await addPropertyReview(
      property_id,
      guest_id,
      rating,
      comment
    );
    res.status(201).send({ review: newReview });
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  const { id: review_id } = req.params;

  try {
    await deleteReviewById(review_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
