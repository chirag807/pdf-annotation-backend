const express = require("express");
const User = require("../models/User");

const { auth, authorize } = require("../middleware/auth");
const { getStatusController, getUsersController } = require("../controller/adminController");

const router = express.Router();

router.get("/stats", auth, authorize(["admin"]), getStatusController);
// Get all users
router.get("/users", auth, authorize(["admin"]), getUsersController);

// Update user role
router.patch("/users/:id/role", auth, authorize(["admin"]), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role, updatedAt: Date.now() }, { new: true });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
});

// Delete user
router.delete("/users/:id", auth, authorize(["admin"]), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

module.exports = router;
