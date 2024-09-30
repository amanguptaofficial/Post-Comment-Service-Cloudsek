const sendResponse = (res, statusCode, message, data = null, success = false) => {
    res.status(statusCode).json({
        status: statusCode,
        message,
        data,
        success
    })
}

module.exports = {
    sendResponse
}

