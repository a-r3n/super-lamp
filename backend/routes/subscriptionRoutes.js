const express = require('express');
const router = express.Router();
const User = require('../models/User');  // Ensure path is correct

// Endpoint to check subscription status
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.json({ isSubscribed: user.isSubscribed });
    } catch (error) {
        console.error('Failed to check subscription:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

module.exports = router;
