const jwtModule = require('./jwtModule')
const httpStatus = require('../lib/httpStatus');
const config = require('../config/index');

function verifyToken(req, res, next) {
  const token = jwtModule.parseTokenFromAuthorizationHeader(req)
  if (token) {
    const verifyResult = jwtModule.verify(token, { audience: config.audience })
    if (verifyResult && verifyResult.id) {
      req.userId = verifyResult.id;
      next();
    } else {
      return res.status(httpStatus.FORBIDDEN).send('Bearer token failed verification');
    }
  } else {
    return res.status(httpStatus.FORBIDDEN).send('Bearer token not provided as expected in authorization header');
  }
}
module.exports = verifyToken;
