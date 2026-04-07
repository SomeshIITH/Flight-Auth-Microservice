const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config();

module.exports = {
    PORT : process.env.PORT || 3001,
    SALT : bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS)),
    JWT_KEY : process.env.JWT_KEY,
    NODE_ENV: process.env.NODE_ENV || 'development'
}