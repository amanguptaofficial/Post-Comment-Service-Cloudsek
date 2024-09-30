const httpStatus = require("http-status");
const post = require("../models/Post");
const User = require("../models/User");
const responseManagement = require("../utils/responseManagement");
const mongoose = require("mongoose");

const createPost = async (req, res) => {
  try {
    const { userId, title, tags, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return responseManagement.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        "Invalid User ID format"
      );
    }
    const isUserExist = await User.findById(userId);
    if (!isUserExist)
      return responseManagement.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        "User does not exist with this userId"
      );

    const createdPost = await post.create({ userId, title, tags, content });

    return responseManagement.sendResponse(
      res,
      httpStatus.OK,
      "Post Created Successfully..",
      createdPost,
      true
    );
  } catch (error) {
    return responseManagement.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong creating post"
    );
  }
};

const getPostByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate the userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return responseManagement.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        "Invalid User ID format"
      );
    }

    console.log("=====> userId: ", userId);

    // Fetch posts for the given userId
    const data = await post.find({ userId: userId });

    console.log("=> posts:", data);

    // Check if any posts were found
    if (data.length > 0) {
      return responseManagement.sendResponse(
        res,
        httpStatus.OK,
        "Posts fetched successfully",
        data,
        true
      );
    } else {
      return responseManagement.sendResponse(
        res,
        httpStatus.OK,
        "No posts found",
        data,
        true
      );
    }
  } catch (error) {
    console.error("Error fetching posts:", error); // Log the full error for debugging
    return responseManagement.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong while fetching posts"
    );
  }
};

const getAllPost = async (req, res) => {
  try {
    const data = await post.find();

    if (data.length > 0) {
      return responseManagement.sendResponse(
        res,
        httpStatus.OK,
        "Posts fetched successfully",
        data,
        true
      );
    } else {
      return responseManagement.sendResponse(
        res,
        httpStatus.OK,
        "No posts found",
        [],
        true
      );
    }
  } catch (error) {
    return responseManagement.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong while fetching posts"
    );
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.tokenUserId;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return responseManagement.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        "Invalid Post ID format"
      );
    }

    const isPost = await post.findById(postId);

    if (!isPost) {
      return responseManagement.sendResponse(
        res,
        httpStatus.NOT_FOUND,
        "Post not found"
      );
    }

    if (isPost.userId.toString() !== userId) {
      return responseManagement.sendResponse(
        res,
        httpStatus.FORBIDDEN,
        "You can only delete your own posts"
      );
    }

    await post.findByIdAndDelete(postId);

    return responseManagement.sendResponse(
      res,
      httpStatus.OK,
      "Post deleted successfully"
    );
  } catch (error) {
    return responseManagement.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong while fetching posts"
    );
  }
};

module.exports = {
  createPost,
  getPostByUserId,
  getAllPost,
  deletePost,
};
