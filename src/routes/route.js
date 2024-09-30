const express = require("express");
const { registerUser, userLogin } = require("../controllers/userController");
const { validateUser, loginValidateUser } = require("../validations/createUserValidations");
const { validatePost } = require("../validations/createPostValidation");
const { createPost, getPostByUserId } = require("../controllers/postController");
const { validateGetPostByUserId } = require("../validations/getPostByUserId");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("everthing okay");
  res.send("OK");
});

// user-routes
router.post("/register", validateUser, registerUser);
router.post("/login", loginValidateUser, userLogin);

//post-routes
router.post("/createPost", validatePost, createPost);
router.get("/getAllPostByUserId", validateGetPostByUserId, getPostByUserId);
// router.post("/getAllPost", createPost);

//comment-routes
router.post("/comment")


module.exports = router;
