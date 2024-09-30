const Joi = require("joi");
const { sendResponse } = require("../utils/responseManagement");


// ------------------------------------------------🔥Create User Schema Validation🔥-------------------------------------------
const userSchema = Joi.object().keys({
    name: Joi.string().regex(/^[A-Za-z\s]+$/).message("name contains only the character").required().trim().lowercase(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().lowercase(),
    password: Joi.string().required().trim(),
});

// ------------------------------------------------🔥Login User Schema Validation🔥-------------------------------------------
const userLoginSchema = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().lowercase(),
    password: Joi.string().required().trim(),
});














//----------------------------------------------🔥 register User middleware🔥----------------------------------------------

function validateUser(req, res, next) {
    const result = userSchema.validate(req.body);
    if (!result.error) {
        req.body = result.value;
        next();
    } else {
        return sendResponse(res, httpStatus.BAD_REQUEST, result.error.message);
    }
}

//----------------------------------------------🔥 Login User middleware🔥----------------------------------------------

function loginValidateUser(req, res, next) {
    const result = userLoginSchema.validate(req.body);
    if (!result.error) {
        req.body = result.value;
        next();
    } else {
        return sendResponse(res, httpStatus.BAD_REQUEST, result.error.message);
    }
}

module.exports = {
    validateUser,
    loginValidateUser


}