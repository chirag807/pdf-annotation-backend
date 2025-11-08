const User = require("../models/User");
const Document = require("../models/Document");
const Annotation = require("../models/Annotation");

const getStatusController = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDocuments = await Document.countDocuments({ status: "active" });
    const totalAnnotations = await Annotation.countDocuments();

    res.json({
      totalUsers,
      totalDocuments,
      totalAnnotations,
      activeUsers: await User.countDocuments({ isActive: true }),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};

const getUsersController = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

module.exports = {
  getStatusController,
  getUsersController,
};
