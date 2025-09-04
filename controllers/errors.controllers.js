exports.handlePathNotFound = (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.handleBadRequests = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    if (err.constraint === "reviews_property_id_fkey") {
      res.status(404).send({ msg: "Property Not Found" });
    } else if (err.constraint === "reviews_guest_id_fkey") {
      res.status(404).send({ msg: "User Not Found" });
    }
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
