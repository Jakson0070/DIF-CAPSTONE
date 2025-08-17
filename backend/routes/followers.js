const express = require('express');
const Follow = require('../models/Follow');
const User = require('../models/User');
const authenticate = require('../middleware/auth');
const router = express.Router();

// GET /api/interactions/followers/:userId/is-following - Check if current user follows userId
router.get('/:userId/is-following', authenticate, async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.userId;
        if (!userId || !currentUserId) {
            return res.status(400).json({ error: 'Missing userId' });
        }
        const isFollowing = await Follow.exists({ followerId: currentUserId, followedId: userId });
        res.json({ isFollowing: !!isFollowing });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/interactions/followers/:userId - Get followers count for a user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        // Count followers
        const followersCount = await Follow.countDocuments({ followedId: userId });
        res.json({ followersCount });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/interactions/following/:userId - Get following count for a user
router.get('/following/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        // Count following
        const followingCount = await Follow.countDocuments({ followerId: userId });
        res.json({ followingCount });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
