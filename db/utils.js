const format = require("pg-format");
const db = require("./connection");

const {
  usersData,
  propertyTypesData,
  propertiesData,
  reviewsData,
} = require("./data/dev");

// users data
const formattedUsersData = usersData.map(
  ({ first_name, surname, email, phone_number, is_host, avatar }) => [
    first_name,
    surname,
    email,
    phone_number,
    is_host,
    avatar,
  ]
);

// property types data
const formattedPropertyTypesData = propertyTypesData.map(
  ({ property_type, description }) => [property_type, description]
);

// properties data
function createUserIdRef(userArray) {
  const ref = {};
  for (const user of userArray) {
    const fullName = user.first_name + " " + user.surname;
    ref[fullName] = user.user_id;
  }
  return ref;
}

function formatPropertiesData(propertiesData, userArray) {
  const userIdRef = createUserIdRef(userArray);
  return propertiesData.map((property) => {
    const host_id = userIdRef[property.host_name];
    return [
      host_id,
      property.name,
      property.property_type,
      property.location,
      property.price_per_night,
      property.description,
    ];
  });
}

// reviews data
function createPropertyIdRef(propertiesArray) {
  const ref = {};
  for (const property of propertiesArray) {
    ref[property.name] = property.property_id;
  }
  return ref;
}

function createGuestIdRef(userArray) {
  const ref = {};
  for (const user of userArray) {
    const fullName = user.first_name + " " + user.surname;
    ref[fullName] = user.user_id;
  }
  return ref;
}

function formatReviewsData(reviewsData, propertiesArray, userArray) {
  const propertyIdRef = createPropertyIdRef(propertiesArray);
  const guestIdRef = createGuestIdRef(userArray);
  const formatted = reviewsData.map((review) => {
    const property_id = propertyIdRef[review.property_name];
    const guest_id = guestIdRef[review.guest_name];

    if (!guest_id) {
      console.error("Missing data. Failed to add review:", {
        guest_id,
        review,
      });
      return null;
    }

    return [
      property_id,
      guest_id,
      review.rating,
      review.comment,
      review.created_at,
    ];
  });
  return formatted.filter(Boolean);
}

const checkExists = async (
  table,
  column,
  value,
  notFoundMsg = "Resource not found"
) => {
  const queryStr = format("SELECT 1 FROM %I WHERE %I = $1;", table, column);
  const { rows } = await db.query(queryStr, [value]);

  if (!rows.length) {
    return Promise.reject({ status: 404, msg: notFoundMsg });
  }
};

module.exports = {
  formattedUsersData,
  formattedPropertyTypesData,
  formatPropertiesData,
  formatReviewsData,
  checkExists,
};
