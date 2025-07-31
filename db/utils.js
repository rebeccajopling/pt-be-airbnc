const { usersData, propertyTypesData, propertiesData } = require("./data/test");

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

const formattedPropertyTypesData = propertyTypesData.map(
  ({ property_type, description }) => [property_type, description]
);

const formattedPropertiesData = propertiesData.map(
  ({
    name,
    property_type,
    location,
    price_per_night,
    description,
    host_name,
    amenities,
  }) => [
    name,
    property_type,
    location,
    price_per_night,
    description,
    host_name,
    amenities,
  ]
);

module.exports = {
  formattedUsersData,
  formattedPropertyTypesData,
  formattedPropertiesData,
};
