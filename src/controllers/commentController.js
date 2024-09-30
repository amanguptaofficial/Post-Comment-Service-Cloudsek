const httpStatus = require("http-status");
const responseManagement = require("../utils/responseManagement");
const comment = require("../models/Comment");
const post = require("../models/Post");

const addComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const userId = req.tokenUserId;

    if (!postId || !text) {
      return responseManagement.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        "Post ID and comment text are required",
        {}
      );
    }

    const newComment = {
      postId,
      userId,
      text,
    };

    const savedComment = await comment.create(newComment);

    await post.findByIdAndUpdate(
      postId,
      { $push: { comments: savedComment._id } },
      { new: true }
    );

    return responseManagement.sendResponse(
      res,
      httpStatus.CREATED,
      "Comment added successfully",
      savedComment,
      true
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return responseManagement.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong while adding the comment",
      {}
    );
  }
};

const editComment = async (req, res) => {
  try {
    const { commentId, text } = req.body;
    const userId = req.tokenUserId;

    if (!commentId || !text) {
      return responseManagement.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        "Comment ID and new text are required",
        {}
      );
    }

    const foundComment = await comment.findById(commentId);

    if (!foundComment) {
      return responseManagement.sendResponse(
        res,
        httpStatus.NOT_FOUND,
        "Comment not found",
        {}
      );
    }

    if (foundComment.userId.toString() !== userId) {
      return responseManagement.sendResponse(
        res,
        httpStatus.FORBIDDEN,
        "You can only edit your own comments",
        {}
      );
    }

    foundComment.text = text;
    await comment.updateOne({ text: foundComment.text });

    return responseManagement.sendResponse(
      res,
      httpStatus.OK,
      "Comment updated successfully",
      comment,
      true
    );
  } catch (error) {
    console.error("Error editing comment:", error);
    return responseManagement.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong while editing the comment",
      {}
    );
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    const userId = req.tokenUserId;

    if (!commentId) {
      return responseManagement.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        "Comment ID is required",
        {}
      );
    }

    const foundComment = await comment.findById(commentId);

    if (!foundComment) {
      return responseManagement.sendResponse(
        res,
        httpStatus.NOT_FOUND,
        "Comment not found",
        {}
      );
    }

    if (foundComment.userId.toString() !== userId) {
      return responseManagement.sendResponse(
        res,
        httpStatus.FORBIDDEN,
        "You can only delete your own comments",
        {}
      );
    }

    await comment.findByIdAndDelete(commentId);

    await post.findByIdAndUpdate(
      foundComment.postId,
      { $pull: { comments: commentId } },
      { new: true }
    );

    return responseManagement.sendResponse(
      res,
      httpStatus.OK,
      "Comment deleted successfully",
      {},
      true
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return responseManagement.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong while deleting the comment",
      {}
    );
  }
};

module.exports = {
  addComment,
  editComment,
  deleteComment,
};
