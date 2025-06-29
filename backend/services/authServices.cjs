const User = require("../models/user.cjs");

exports.getOneUser = async ({ id, name, email }) => {
  console.log(id, name, email);

  return await User.findOne({ email: email });
};

exports.addUser = async (newUser) => {
  const addedUser = await User.create(newUser);
  console.log(addedUser);
  return "User added successfully";
};
