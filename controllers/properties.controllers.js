const {
  fetchAllProperties,
  fetchPropertyReviews,
  fetchUsers,
  fetchPropertyById,
  addPropertyReview,
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
    return res.status(200).send({ properties: properties });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getPropertyById = async (req, res, next) => {
  const { id: property_id } = req.params;
  try {
    const property = await fetchPropertyById(property_id);
    res.status(200).send({ property: property });
  } catch (err) {
    next(err);
  }
};

exports.getPropertyReviews = async (req, res, next) => {
  const { id: property_id } = req.params;
  try {
    const reviews = await fetchPropertyReviews(property_id);
    return res.status(200).send({ reviews: reviews });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  const { id: user_id } = req.params;
  try {
    const user = await fetchUsers(user_id);
    return res.status(200).send({ user: user });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.postPropertyReview = async (req, res, next) => {
  const { id: property_id } = req.params;
  const { guest_id, rating, comment } = req.body;

  try {
    const newReview = await addPropertyReview(
      property_id,
      guest_id,
      rating,
      comment
    );
    res.status(201).send({ review: newReview });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
