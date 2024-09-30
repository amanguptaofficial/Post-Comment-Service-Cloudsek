const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    postId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    text: {
        type: String,
        required: true
    },

}, { timestamps: true });

const comment = mongoose.model("comment", commentSchema);

module.exports = comment