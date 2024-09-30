const jwt = require("jsonwebtoken");
const responseManagement = require("../utils/responseManagement");
const httpStatus = require("http-status");

//-------------------------------------------------🔥Check Authentication middileware🔥---------------------------------

const auth = async function (req, res, next) {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      console.log("here");
      return responseManagement.sendResponse(
        res,
        httpStatus.UNAUTHORIZED,
        "Authentication failed: No token provided",
        {}
      );
    } else {
      jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
          return responseManagement.sendResponse(
            res,
            httpStatus.UNAUTHORIZED,
            "Authentication failed: Invalid token",
            {}
          );
        } else {
          req.tokenUserId = decoded.id;
          next();
        }
      });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return responseManagement.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong during authentication",
      {}
    );
  }
};

module.exports = {
  auth,
};
