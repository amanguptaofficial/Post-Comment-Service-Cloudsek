const httpStatus = require("http-status");
const post = require("../models/Post");
const User = require("../models/User");
const responseManagement = require("../utils/responseManagement");
const mongoose = require("mongoose")


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
        const isUserExist = await User.findById(userId)
        if (!isUserExist) return responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, "User does not exist with this userId")

        const createdPost = await post.create({ userId, title, tags, content });

        return responseManagement.sendResponse(res, httpStatus.OK, "Post Created Successfully..", createdPost, true);

    } catch (error) {
        return responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong creating post")
    }
}


const getPostByUserId = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return responseManagement.sendResponse(
                res,
                httpStatus.BAD_REQUEST,
                "Invalid User ID format"
            );
        }
        console.log("=====> userId; ", userId)
        const data = await post.find({userId: mongoose.Types.ObjectId(userId) })
        console.log("=> post",data)

            if(data && data.length){
                return responseManagement.sendResponse(res, httpStatus.OK, "Post fetched Successfully..", data, true);

            }else{
                return responseManagement.sendResponse(res, httpStatus.OK, "No Post Found", data, true);

            }



    } catch (error) {
        console.log(error.message)
        return responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong to fetching post")
    }
}

module.exports = {
    createPost,
    getPostByUserId

}