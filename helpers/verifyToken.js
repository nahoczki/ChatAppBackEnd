const jwt = require('jsonwebtoken');
const {handleErrorMsg} = require("../helpers/error-handler");

module.exports = function (req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send(handleErrorMsg(401, "Access Denied"));

    try {
        req.user = jwt.verify(token, process.env.TOKEN_SECRET);
        next();
    } catch (e) {
        res.status(400).send(handleErrorMsg(400, "Invalid Token"));
    }

}