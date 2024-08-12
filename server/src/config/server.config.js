require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3001,
    ATLAS_DB_URL: process.env.ATLAS_DB_URL
}