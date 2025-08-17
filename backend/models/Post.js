// backend/models/Post.js
const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mediaUrl: { type: String },
    mediaId: { type: String }, // Cloudinary public_id
    caption: { type: String },
    hashtags: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // <-- Added for population
});
postSchema.index({ userId: 1, createdAt: -1 });
module.exports = mongoose.model('Post', postSchema);