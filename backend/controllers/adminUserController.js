// controllers/adminUserController.js

const User = require('../models/User');

// Get all users (with optional search)
const getAllUsers = async (req, res) => {
  try {
    const searchQuery = req.query.search;

    // 🔍 Build search filter if search query exists
    const filter = searchQuery
      ? {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { email: { $regex: searchQuery, $options: 'i' } }
          ]
        }
      : {};

    const users = await User.find(filter).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle admin status for a user
const toggleAdminStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.role = user.role === 'admin' ? 'user' : 'admin';
      await user.save();
      res.status(200).json({ message: 'User role updated successfully', newRole: user.role });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  toggleAdminStatus,
};
