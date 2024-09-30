const Joi = require("joi");
const responseManagement = require("../utils/responseManagement");
const httpStatus = require("http-status");

// ------------------------------------------------Get By User Id POST Schema Validation🔥-------------------------------------------
const getPostByUserIdSchema = Joi.object().keys({
  userId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/) // MongoDB ObjectId format
    .messages({
      "string.pattern.base":
        "Invalid userId format. It must be a valid ObjectId.",
      "any.required": "userId is required.",
    }),
});

//----------------------------------------------🔥 create post middleware🔥----------------------------------------------
function validateGetPostByUserId(req, res, next) {
  const result = getPostByUserIdSchema.validate(req.params);
  if (!result.error) {
    req.query = result.value;
    next();
  } else {
    return responseManagement.sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      result.error.message
    );
  }
}

module.exports = {
  validateGetPostByUserId,
};
