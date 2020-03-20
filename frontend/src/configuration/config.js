const dotenv = require('dotenv').config();

module.exports = {
    apiURL: process.env.REACT_APP_API_URL,
    port: process.env.PORT
};
