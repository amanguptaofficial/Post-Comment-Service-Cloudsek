const User = require("../models/User");
const bcrypt = require("bcrypt");
const responseManagement = require("../utils/responseManagement");
const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
// ------------------------------------------------🔥USER REGISTRATION API🔥-------------------------------------------
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const isExistingUser = await User.findOne({ email })
        console.log(isExistingUser);
        if (isExistingUser) return responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, "User Already Exists with this emailid");
        const hashPassword = bcrypt.hashSync(password, 5);
        const createdUser = await User.create({ name, email, password: hashPassword });
        return responseManagement.sendResponse(res, httpStatus.OK, "user registered successfully", createdUser, true);
    } catch (error) {
        console.log(error)
        return responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong");
    }
}

// ------------------------------------------------🔥USER LOGIN API🔥-------------------------------------------

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return responseManagement.sendResponse(res, httpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return responseManagement.sendResponse(res, httpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return responseManagement.sendResponse(res, httpStatus.OK, "Login successful", { token }, true);
    } catch (error) {
        console.error("Error during user login:", error);
        return responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong");
    }
};


module.exports = {
    registerUser,
    userLogin
}
