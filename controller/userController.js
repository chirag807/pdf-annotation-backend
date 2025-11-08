const { getProfile, updateProfile } = require("../service/userService");

const getProfileController = async (req, res) => {
  try {
    const result = await getProfile(req.user._id);
    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }
    res.json(result.user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const result = await updateProfile(req.user._id, req.body);
    if (result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }
    res.json(result.user);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

module.exports = {
  getProfileController,
  updateProfileController,
};
