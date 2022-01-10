const jwt = require('jsonwebtoken');
const { StatusCode } = require('../utils/index');

const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token === null) return res.status(StatusCode.UNAUTHORIZED).json({ status: `${StatusCode.UNAUTHORIZED}` });

    jwt.verify(token, `secret`, async (err, decoded) => {
        if (err) return res.status(StatusCode.FORBIDDEN).json({ status: `${StatusCode.FORBIDDEN}` });
        req.user = decoded;
        next();
    });
}

const isNotLoggedIn = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token === null) return res.status(StatusCode.UNAUTHORIZED).json({ status: `${StatusCode.UNAUTHORIZED}` });

    // eslint-disable-next-line no-unused-vars
    jwt.verify(token, `secret`, async (err, decoded) => {
        if (err) return res.status(StatusCode.FORBIDDEN).json({ status: `${StatusCode.FORBIDDEN}` });
        req.user = null;
        next();
    });
};

module.exports = { isAuthenticated, isNotLoggedIn };

