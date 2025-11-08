const User = require("../models/User");

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    return { status: 404, message: "User not found" };
  }
  return { status: 200, user };
};

const updateProfile = async (userId, updateData) => {
  const { name } = updateData;
  const user = await User.findByIdAndUpdate(userId, { name, updatedAt: Date.now() }, { new: true });

  if (!user) {
    return { status: 404, message: "User not found" };
  }

  return { status: 200, user };
};

module.exports = {
  getProfile,
  updateProfile,
};
