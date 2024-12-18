const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const TOKEN_KEY  = process.env.TOKEN_KEY;
const { secreteKey } = require("../Configration/jwtConfig")

module.exports.generateSecretToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, TOKEN_KEY, {
    expiresIn: '1h',
  });
};
