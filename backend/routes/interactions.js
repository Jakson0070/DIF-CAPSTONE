// //backend/routes/interactions.js
// const express = require('express');
// const { body, validationResult } = require('express-validator');
// const authenticate = require('../middleware/auth');
// const Like = require('../models/Like');
// const Comment = require('../models/Comment');
// const Follow = require('../models/Follow');
// const Notification = require('../models/Notification');
// const Post = require('../models/Post');
// const followersRoutes = require('./followers');
// const router = express.Router();

// // Mount followers routes
// router.use('/followers', followersRoutes);

// /**
//  * @swagger
//  * /api/interactions/like:
//  *   post:
//  *     summary: Like a post
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               postId: { type: string }
//  *     responses:
//  *       200: { description: Post liked }
//  */
// router.post(
//     '/like',
//     authenticate,
//     [body('postId').isMongoId()],
//     async (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         try {
//             const { userId } = req.user;
//             const { postId } = req.body;

//             const existingLike = await Like.findOne({ postId, userId });
//             if (existingLike) {
//                 return res.status(400).json({ error: 'Already liked' });
//             }

//             const like = new Like({ postId, userId });
//             await like.save();

//             // Increment likes count on the post
//             await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } });

//             const post = await Post.findById(postId);
//             await Notification.create({
//                 userId: post.userId,
//                 type: 'like',
//                 fromUserId: userId,
//                 postId,
//             });

//             res.json({ message: 'Post liked' });
//         } catch (error) {
//             res.status(500).json({ error: 'Server error' });
//         }
//     }
// );

// /**
//  * @swagger
//  * /api/interactions/like:
//  *   delete:
//  *     summary: Unlike a post
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               postId: { type: string }
//  *     responses:
//  *       200: { description: Post unliked }
//  */
// router.delete(
//     '/like',
//     authenticate,
//     [body('postId').isMongoId()],
//     async (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         try {
//             const { userId } = req.user;
//             const { postId } = req.body;

//             await Like.deleteOne({ postId, userId });

//             // Decrement likes count on the post
//             await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } });

//             res.json({ message: 'Post unliked' });
//         } catch (error) {
//             res.status(500).json({ error: 'Server error' });
//         }
//     }
// );

// /**
//  * @swagger
//  * /api/interactions/comment:
//  *   post:
//  *     summary: Comment on a post
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               postId: { type: string }
//  *               text: { type: string }
//  *     responses:
//  *       201: { description: Comment created }
//  */
// router.post(
//     '/comment',
//     authenticate,
//     [body('postId').isMongoId(), body('text').notEmpty().trim()],
//     async (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         try {
//             const { userId } = req.user;
//             const { postId, text } = req.body;

//             const comment = new Comment({ postId, userId, text });
//             await comment.save();

//             const post = await Post.findById(postId);
//             await Notification.create({
//                 userId: post.userId,
//                 type: 'comment',
//                 fromUserId: userId,
//                 postId,
//             });

//             res.status(201).json(comment);
//         } catch (error) {
//             res.status(500).json({ error: 'Server error' });
//         }
//     }
// );

// /**
//  * @swagger
//  * /api/interactions/follow:
//  *   post:
//  *     summary: Follow a user
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               followedId: { type: string }
//  *     responses:
//  *       200: { description: User followed }
//  */
// router.post(
//     '/follow',
//     authenticate,
//     [body('followedId').isMongoId()],
//     async (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         try {
//             const { userId } = req.user;
//             const { followedId } = req.body;

//             if (userId === followedId) {
//                 return res.status(400).json({ error: 'Cannot follow yourself' });
//             }

//             const existingFollow = await Follow.findOne({ followerId: userId, followedId });
//             if (existingFollow) {
//                 return res.status(400).json({ error: 'Already following' });
//             }

//             const follow = new Follow({ followerId: userId, followedId });
//             await follow.save();

//             await Notification.create({
//                 userId: followedId,
//                 type: 'follow',
//                 fromUserId: userId,
//             });

//             res.json({ message: 'User followed' });
//         } catch (error) {
//             res.status(500).json({ error: 'Server error' });
//         }
//     }
// );

// /**
//  * @swagger
//  * /api/interactions/follow:
//  *   delete:
//  *     summary: Unfollow a user
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               followedId: { type: string }
//  *     responses:
//  *       200: { description: User unfollowed }
//  */
// router.delete(
//     '/follow',
//     authenticate,
//     [body('followedId').isMongoId()],
//     async (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         try {
//             const { userId } = req.user;
//             const { followedId } = req.body;

//             await Follow.deleteOne({ followerId: userId, followedId });
//             res.json({ message: 'User unfollowed' });
//         } catch (error) {
//             res.status(500).json({ error: 'Server error' });
//         }
//     }
// );

// module.exports = router;

// //backend/routes/interactions.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const authenticate = require('../middleware/auth');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Follow = require('../models/Follow');
const Notification = require('../models/Notification');
const Post = require('../models/Post');
const followersRoutes = require('./followers');
const router = express.Router();

// Mount followers routes
router.use('/followers', followersRoutes);

/**
 * @swagger
 * /api/interactions/like:
 *   post:
 *     summary: Like a post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId: { type: string }
 *     responses:
 *       200: { description: Post liked }
 */
router.post(
    '/like',
    authenticate,
    [body('postId').isMongoId()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Like POST validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { userId } = req.user;
            const { postId } = req.body;
            console.log(`Like POST request: userId=${userId}, postId=${postId}`);
            console.log('Types:', { postId: typeof postId, userId: typeof userId });

            // Log the query being used
            console.log('Checking for existing like:', { postId, userId });
            const existingLike = await Like.findOne({ postId, userId });
            console.log('Result of Like.findOne:', existingLike);
            if (existingLike) {
                console.log(`Like already exists for postId=${postId}, userId=${userId}`);
                return res.status(400).json({ error: 'Already liked' });
            }

            const like = new Like({ postId, userId });
            await like.save();
            console.log(`Like saved: postId=${postId}, userId=${userId}`);

            const updatedPost = await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } }, { new: true });
            console.log(`Post updated: postId=${postId}, new likes=${updatedPost.likes}`);

            const post = await Post.findById(postId);
            await Notification.create({
                userId: post.userId,
                type: 'like',
                fromUserId: userId,
                postId,
            });
            console.log(`Notification created for postId=${postId}`);

            res.json({ message: 'Post liked' });
        } catch (error) {
            console.error('Like POST error:', error.stack);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

/**
 * @swagger
 * /api/interactions/like:
 *   delete:
 *     summary: Unlike a post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId: { type: string }
 *     responses:
 *       200: { description: Post unliked }
 */
router.delete(
    '/follow',
    authenticate,
    [body('followedId').isMongoId()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { userId } = req.user;
            const { followedId } = req.body;

            await Follow.deleteOne({ followerId: userId, followedId });
            res.json({ message: 'User unfollowed' });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }
);

module.exports = router;
// backend/routes/interactions.js

router.delete(
    '/like',
    authenticate,
    [body('postId').isMongoId()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Like DELETE validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { userId } = req.user;
            const { postId } = req.body;
            console.log(`Like DELETE request: userId=${userId}, postId=${postId}`);

            const deletedLike = await Like.deleteOne({ postId, userId });
            console.log(`Like deleted: postId=${postId}, userId=${userId}, result=${JSON.stringify(deletedLike)}`);

            const updatedPost = await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } }, { new: true });
            console.log(`Post updated: postId=${postId}, new likes=${updatedPost?.likes || 'not found'}`);

            res.json({ message: 'Post unliked' });
        } catch (error) {
            console.error('Like DELETE error:', error.stack);
            res.status(500).json({ error: 'Server error' });
        }
    }
);
/**
 * @swagger
 * /api/interactions/comment:
 *   post:
 *     summary: Comment on a post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId: { type: string }
 *               text: { type: string }
 *     responses:
 *       201: { description: Comment created }
 */
router.post(
    '/comment',
    authenticate,
    [body('postId').isMongoId(), body('text').notEmpty().trim()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { userId } = req.user;
            const { postId, text } = req.body;

            const comment = new Comment({ postId, userId, text });
            await comment.save();

            // Push the new comment's _id to the post's comments array
            await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

            const post = await Post.findById(postId);
            await Notification.create({
                userId: post.userId,
                type: 'comment',
                fromUserId: userId,
                postId,
            });

            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }
);

/**
 * @swagger
 * /api/interactions/follow:
 *   post:
 *     summary: Follow a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               followedId: { type: string }
 *     responses:
 *       200: { description: User followed }
 */
router.post(
    '/follow',
    authenticate,
    [body('followedId').isMongoId()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { userId } = req.user;
            const { followedId } = req.body;

            if (userId === followedId) {
                return res.status(400).json({ error: 'Cannot follow yourself' });
            }

            const existingFollow = await Follow.findOne({ followerId: userId, followedId });
            if (existingFollow) {
                return res.status(400).json({ error: 'Already following' });
            }

            const follow = new Follow({ followerId: userId, followedId });
            await follow.save();

            await Notification.create({
                userId: followedId,
                type: 'follow',
                fromUserId: userId,
            });

            res.json({ message: 'User followed' });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }
);

/**
 * @swagger
 * /api/interactions/follow:
 *   delete:
 *     summary: Unfollow a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               followedId: { type: string }
 *     responses:
 *       200: { description: User unfollowed }
 */
