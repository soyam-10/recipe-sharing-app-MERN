const User = require('../models/user.model');

const promoteToAdmin = async (req, res) => {
    const { userId } = req.body; // User ID to be promoted

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the current user has admin privileges
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        user.role = 'admin';
        await user.save();
        res.status(200).json({ message: 'User promoted to admin', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { promoteToAdmin };
