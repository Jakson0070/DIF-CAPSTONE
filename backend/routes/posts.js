// // backend/routes/posts.js
// console.log('posts.js loaded');
// const express = require('express');
// const { body, query, validationResult } = require('express-validator');
// const authenticate = require('../middleware/auth');
// const Post = require('../models/Post');
// const Notification = require('../models/Notification');
// const Follow = require('../models/Follow');
// const mongoose = require('mongoose');
// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');
// const upload = multer({ limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB limit
// const router = express.Router();
// const dotenv = require('dotenv');
// dotenv.config();

// // Add debug logger function
// const stepLogger = (step, data) => {
//     console.log(`[FEED DEBUG] ${step}:`, data);
// };

// /**
//  * @swagger
//  * /api/posts/feed:
//  *   get:
//  *     summary: Get posts feed
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         schema: { type: integer, default: 1 }
//  *       - in: query
//  *         name: limit
//  *         schema: { type: integer, default: 20 }
//  *     responses:
//  *       200: { description: Posts feed }
//  */
// // IMPORTANT: Feed route MUST come before /:id route
// router.get(
//     '/feed',
//     (req, res, next) => {
//         console.log('FEED ROUTE ABSOLUTE TOP');
//         next();
//     },
//     authenticate,
//     [query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1 })],
//     async (req, res) => {
//         console.log('FEED ROUTE HIT');
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             console.log('FEED VALIDATION ERRORS:', errors.array());
//             return res.status(400).json({ errors: errors.array() });
//         }

//         try {
//             if (!req.user || !req.user.userId) {
//                 console.error('FEED ERROR: req.user or req.user.userId is missing', req.user);
//                 return res.status(401).json({ error: 'Unauthorized: user not found in request' });
//             }
//             const { userId } = req.user;
//             const page = parseInt(req.query.page) || 1;
//             const limit = parseInt(req.query.limit) || 20;
//             const skip = (page - 1) * limit;

//             console.log('FEED DEBUG: userId:', userId);
//             let follows;
//             try {
//                 follows = await Follow.find({ followerId: userId }).select('followedId');
//                 stepLogger('FOLLOWS_FETCHED', follows);
//             } catch (followErr) {
//                 console.error('FEED ERROR: Error fetching follows:', followErr.stack);
//                 return res.status(500).json({ error: 'Error fetching follows' });
//             }

//             let followedIds;
//             try {
//                 followedIds = follows
//                     .map(f => f.followedId)
//                     .filter(id => mongoose.Types.ObjectId.isValid(id));
//                 stepLogger('FOLLOWED_IDS', followedIds);
//             } catch (mapErr) {
//                 console.error('FEED ERROR: Error mapping followedIds:', mapErr.stack);
//                 return res.status(500).json({ error: 'Error mapping followedIds' });
//             }

//             // Always include current user's own posts in the feed
//             const allIds = [...followedIds, userId];
//             stepLogger('ALL_IDS', allIds);
            
//             let posts;
//             try {
//                 posts = await Post.find({ userId: { $in: allIds } })
//                     .populate({
//                         path: 'userId',
//                         select: 'username profilePicture',
//                         match: { _id: { $exists: true } }, // Ensure user exists
//                     })
//                     .sort({ createdAt: -1 })
//                     .skip(skip)
//                     .limit(limit);
//                 stepLogger('POSTS_FETCHED', posts.length);
                
//                 if (!posts || posts.length === 0) {
//                     stepLogger('NO_POSTS_FOUND', posts);
//                     // Return empty array instead of early return to ensure consistent response
//                     return res.json([]);
//                 }

//                 // Transform posts to match frontend Post interface
//                 const transformedPosts = posts.map(post => ({
//                     id: post._id.toString(),
//                     username: post.userId?.username || 'Unknown',
//                     userImage: post.userId?.profilePicture || '',
//                     postImage: post.mediaUrl || '',
//                     likes: post.likes || 0,
//                     caption: post.caption || '',
//                     timeAgo: post.createdAt
//                         ? Math.floor((Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60)) + 'h'
//                         : 'Unknown',
//                     isLiked: false, // Adjust based on user interaction
//                     isSaved: false, // Adjust based on user interaction
//                     comments: post.comments || [],
//                 }));

//                 stepLogger('TRANSFORMED_POSTS', transformedPosts.length);
//                 stepLogger('FEED_RESPONSE', transformedPosts);
//                 res.json(transformedPosts);
//             } catch (postErr) {
//                 console.error('FEED ERROR: Error fetching posts:', postErr.stack);
//                 return res.status(500).json({ error: 'Error fetching posts' });
//             }
//         } catch (error) {
//             console.error('FEED ERROR: Unhandled error:', error.stack);
//             res.status(500).json({ error: 'Server error' });
//         }
//     }
// );

// /**
//  * @swagger
//  * /api/posts:
//  *   post:
//  *     summary: Create a post
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               media: { type: string, format: binary }
//  *               caption: { type: string }
//  *               hashtags: { type: array, items: { type: string } }
//  *     responses:
//  *       201: { description: Post created }
//  */
// router.post(
//     '/',
//     authenticate,
//     upload.single('media'),
//     [body('caption').optional().trim(), body('hashtags').optional().isArray()],
//     async (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         try {
//             const { userId } = req.user;
//             const { caption, hashtags } = req.body;
//             let mediaUrl = undefined;
//             let mediaId = undefined;

//             if (req.file) {
//                 let result;
//                 if (req.file.buffer) {
//                     // Use upload_stream for buffer
//                     result = await new Promise((resolve, reject) => {
//                         const stream = cloudinary.uploader.upload_stream({
//                             folder: `posts/${userId}`,
//                             resource_type: 'auto',
//                             allowed_formats: ['jpg', 'png', 'mp4'],
//                             transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
//                         }, (error, res) => {
//                             if (error) return reject(error);
//                             resolve(res);
//                         });
//                         stream.end(req.file.buffer);
//                     });
//                 } else {
//                     // Use file path if available (disk storage)
//                     result = await cloudinary.uploader.upload(req.file.path, {
//                         folder: `posts/${userId}`,
//                         resource_type: 'auto',
//                         allowed_formats: ['jpg', 'png', 'mp4'],
//                         transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
//                     });
//                 }
//                 mediaUrl = result.secure_url;
//                 mediaId = result.public_id;
//             }

//             const post = new Post({
//                 userId,
//                 mediaUrl,
//                 mediaId,
//                 caption,
//                 hashtags,
//             });
//             await post.save();

//             res.status(201).json(post);
//         } catch (error) {
//             console.error('Error in POST /api/posts:', error);
//             console.error('Request body:', req.body);
//             console.error('Request file:', req.file);
//             res.status(500).json({ error: 'Server error' });
//         }
//     }
// );

// /**
//  * @swagger
//  * /api/posts/{id}:
//  *   get:
//  *     summary: Get a post
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema: { type: string }
//  *     responses:
//  *       200: { description: Post details }
//  *       404: { description: Post not found }
//  */
// router.get('/:id', async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id).populate('userId', 'username profilePicture');
//         if (!post) {
//             return res.status(404).json({ error: 'Post not found' });
//         }
//         res.json(post);
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// /**
//  * @swagger
//  * /api/posts/{id}:
//  *   delete:
//  *     summary: Delete a post
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema: { type: string }
//  *     responses:
//  *       200: { description: Post deleted }
//  *       403: { description: Unauthorized }
//  */
// router.delete('/:id', authenticate, async (req, res) => {
//     try {
//         const { userId } = req.user;
//         const post = await Post.findById(req.params.id);
//         if (!post) {
//             return res.status(404).json({ error: 'Post not found' });
//         }
//         if (post.userId.toString() !== userId) {
//             return res.status(403).json({ error: 'Unauthorized' });
//         }
//         await cloudinary.uploader.destroy(post.mediaId);
//         await post.remove();
//         res.json({ message: 'Post deleted' });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// // Get all posts by a specific user (for profile page)
// router.get('/user/:userId', async (req, res) => {
//     try {
//         const posts = await Post.find({ userId: req.params.userId })
//             .sort({ createdAt: -1 });
//         res.json(posts);
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// module.exports = router;


// backend/routes/posts.js
console.log('posts.js loaded');
const express = require('express');
const { body, query, validationResult } = require('express-validator');
const authenticate = require('../middleware/auth');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const Follow = require('../models/Follow');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB limit
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

// Add debug logger function
const stepLogger = (step, data) => {
    console.log(`[FEED DEBUG] ${step}:`, data);
};

/**
 * @swagger
 * /api/posts/feed:
 *   get:
 *     summary: Get posts feed
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200: { description: Posts feed }
 */
// IMPORTANT: Feed route MUST come before /:id route
router.get(
    '/feed',
    (req, res, next) => {
        console.log('FEED ROUTE ABSOLUTE TOP');
        next();
    },
    authenticate,
    [query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1 })],
    async (req, res) => {
        console.log('FEED ROUTE HIT');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('FEED VALIDATION ERRORS:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            if (!req.user || !req.user.userId) {
                console.error('FEED ERROR: req.user or req.user.userId is missing', req.user);
                return res.status(401).json({ error: 'Unauthorized: user not found in request' });
            }
            const { userId } = req.user;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const skip = (page - 1) * limit;

            console.log('FEED DEBUG: userId:', userId);
            let follows;
            try {
                follows = await Follow.find({ followerId: userId }).select('followedId');
                stepLogger('FOLLOWS_FETCHED', follows);
            } catch (followErr) {
                console.error('FEED ERROR: Error fetching follows:', followErr.stack);
                return res.status(500).json({ error: 'Error fetching follows' });
            }

            let followedIds;
            try {
                followedIds = follows
                    .map(f => f.followedId)
                    .filter(id => mongoose.Types.ObjectId.isValid(id));
                stepLogger('FOLLOWED_IDS', followedIds);
            } catch (mapErr) {
                console.error('FEED ERROR: Error mapping followedIds:', mapErr.stack);
                return res.status(500).json({ error: 'Error mapping followedIds' });
            }

            // Always include current user's own posts in the feed
            const allIds = [...followedIds, userId];
            stepLogger('ALL_IDS', allIds);
            
            let posts;
            try {
                posts = await Post.find({ userId: { $in: allIds } })
                    .populate({
                        path: 'userId',
                        select: 'username profilePicture',
                        match: { _id: { $exists: true } }, // Ensure user exists
                    })
                    .populate({
                        path: 'comments.userId',
                        select: 'username profilePicture',
                    })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit);
                stepLogger('POSTS_FETCHED', posts.length);
                
                if (!posts || posts.length === 0) {
                    stepLogger('NO_POSTS_FOUND', posts);
                    return res.json([]);
                }

                // Transform posts to match frontend Post interface
                const transformedPosts = posts.map(post => {
                    // Transform comments
                    const transformedComments = (post.comments || []).map(comment => ({
                        _id: comment._id,
                        id: comment._id.toString(),
                        userId: comment.userId,
                        username: comment.userId?.username || 'Unknown',
                        text: comment.text || comment.content || '',
                        timeAgo: comment.createdAt
                            ? Math.floor((Date.now() - new Date(comment.createdAt).getTime()) / (1000 * 60)) + 'm'
                            : 'now',
                        createdAt: comment.createdAt
                    }));

                    return {
                        id: post._id.toString(),
                        _id: post._id,
                        username: post.userId?.username || 'Unknown',
                        userImage: post.userId?.profilePicture || '',
                        postImage: post.mediaUrl || '',
                        mediaUrl: post.mediaUrl,
                        likes: post.likes || 0,
                        caption: post.caption || '',
                        timeAgo: post.createdAt
                            ? Math.floor((Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60)) + 'h'
                            : 'Unknown',
                        isLiked: false, // You might want to check if current user liked this post
                        isSaved: false, // You might want to check if current user saved this post
                        comments: transformedComments,
                        createdAt: post.createdAt
                    };
                });

                stepLogger('TRANSFORMED_POSTS', transformedPosts.length);
                console.log('Sample transformed post with comments:', transformedPosts[0]?.comments);
                res.json(transformedPosts);
            } catch (postErr) {
                console.error('FEED ERROR: Error fetching posts:', postErr.stack);
                return res.status(500).json({ error: 'Error fetching posts' });
            }
        } catch (error) {
            console.error('FEED ERROR: Unhandled error:', error.stack);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               media: { type: string, format: binary }
 *               caption: { type: string }
 *               hashtags: { type: array, items: { type: string } }
 *     responses:
 *       201: { description: Post created }
 */
router.post(
    '/',
    authenticate,
    upload.single('media'),
    [body('caption').optional().trim(), body('hashtags').optional().isArray()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { userId } = req.user;
            const { caption, hashtags } = req.body;
            let mediaUrl = undefined;
            let mediaId = undefined;

            if (req.file) {
                let result;
                if (req.file.buffer) {
                    // Use upload_stream for buffer
                    result = await new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream({
                            folder: `posts/${userId}`,
                            resource_type: 'auto',
                            allowed_formats: ['jpg', 'png', 'mp4'],
                            transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
                        }, (error, res) => {
                            if (error) return reject(error);
                            resolve(res);
                        });
                        stream.end(req.file.buffer);
                    });
                } else {
                    // Use file path if available (disk storage)
                    result = await cloudinary.uploader.upload(req.file.path, {
                        folder: `posts/${userId}`,
                        resource_type: 'auto',
                        allowed_formats: ['jpg', 'png', 'mp4'],
                        transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
                    });
                }
                mediaUrl = result.secure_url;
                mediaId = result.public_id;
            }

            const post = new Post({
                userId,
                mediaUrl,
                mediaId,
                caption,
                hashtags,
            });
            await post.save();

            res.status(201).json(post);
        } catch (error) {
            console.error('Error in POST /api/posts:', error);
            console.error('Request body:', req.body);
            console.error('Request file:', req.file);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Post details }
 *       404: { description: Post not found }
 */
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('userId', 'username profilePicture')
            .populate({
                path: 'comments.userId',
                select: 'username profilePicture',
            });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Post deleted }
 *       403: { description: Unauthorized }
 */
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { userId } = req.user;
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if (post.userId.toString() !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        await cloudinary.uploader.destroy(post.mediaId);
        await post.remove();
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all posts by a specific user (for profile page)
router.get('/user/:userId', async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.userId })
            .populate('userId', 'username profilePicture')
            .populate({
                path: 'comments',
                populate: { path: 'userId', select: 'username profilePicture' }
            })
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;