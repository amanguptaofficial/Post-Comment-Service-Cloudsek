const express = require("express");
const { registerUser, userLogin } = require("../controllers/userController");
const {
  validateUser,
  loginValidateUser,
} = require("../validations/createUserValidations");
const { validatePost } = require("../validations/createPostValidation");
const {
  createPost,
  getPostByUserId,
  getAllPost,
  deletePost,
} = require("../controllers/postController");
const { validateGetPostByUserId } = require("../validations/getPostByUserId");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { addComment,editComment,deleteComment,} = require("../controllers/commentController");

router.get("/", (req, res) => {
  console.log("everthing okay");
  res.send("OK");
});

// user-routes
router.post("/register", validateUser, registerUser);
router.post("/login", loginValidateUser, userLogin);

//post-routes
router.post("/createPost",auth ,validatePost, createPost);
router.get("/getAllPostByUserId/:userId",auth, validateGetPostByUserId,getPostByUserId);
router.get("/getAllPost", auth, getAllPost);
router.delete("/deletePost/:postId", auth, deletePost);

//comment-routes
router.post("/addComment", auth, addComment);
router.post("/editComment", auth, editComment);
router.post("/deleteComment", auth, deleteComment);

module.exports = router;
