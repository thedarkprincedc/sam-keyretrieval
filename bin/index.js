const { generateToken } = require("authenticator");
const config = require('config')
const { samdotgov } = config

// generate otp using secret key
let otp = generateToken(samdotgov.secretKey);
console.log('Authenticator (One-Time Password): %s\n', otp)

