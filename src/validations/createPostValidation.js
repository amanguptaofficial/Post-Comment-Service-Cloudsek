const Joi = require("joi");
const responseManagement = require("../utils/responseManagement");
const httpStatus = require("http-status");


// ------------------------------------------------🔥Creating POST Schema Validation🔥-------------------------------------------
const postSchema = Joi.object().keys({
    userId: Joi.string()
        .required()
        .regex(/^[0-9a-fA-F]{24}$/) // MongoDB ObjectId format
        .messages({
            'string.pattern.base': 'Invalid userId format. It must be a valid ObjectId.',
            'any.required': 'userId is required.',
        }),

    title: Joi.string()
        .required()
        .trim()
        .min(3)
        .max(100)
        .messages({
            'string.base': 'Title must be a string.',
            'string.empty': 'Title cannot be empty.',
            'string.min': 'Title must be at least 3 characters long.',
            'string.max': 'Title cannot exceed 100 characters.',
            'any.required': 'Title is required.',
        }),

    content: Joi.string()
        .required()
        .trim()
        .min(10)
        .messages({
            'string.base': 'Content must be a string.',
            'string.empty': 'Content cannot be empty.',
            'string.min': 'Content must be at least 10 characters long.',
            'any.required': 'Content is required.',
        }),

    tags: Joi.array()
        .items(Joi.string().trim())
        .messages({
            'array.base': 'Tags must be an array of strings.',
            'string.base': 'Each tag must be a string.',
        })

});


//----------------------------------------------🔥 create post middleware🔥----------------------------------------------
function validatePost(req, res, next) {
    const result = postSchema.validate(req.body);
    if (!result.error) {
        req.body = result.value;
        next();
    } else {
        return responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, result.error.message);
    }
}


module.exports = {
    validatePost
}

