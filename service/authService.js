const User = require("../models/User");
const jwt = require("jsonwebtoken");

const createUser = async (email, password, name, userType) => {
  let user = await User.findOne({ email });
  if (user) {
    return { status: 400, message: "User already exists" };
  }

  user = new User({ email, password, name, role: userType || "viewer" });
  await user.save();

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d",
  });
  return { status: 201, user, token };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return { status: 401, message: "Invalid credentials" };
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return { status: 401, message: "Invalid credentials" };
  }

  user.lastLogin = Date.now();
  await user.save();

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d",
  });

  return { status: 200, user, token };
};

module.exports = { createUser, loginUser };
