module.exports = () => {
    require('dotenv').config({
        path: __dirname + '/config.env',
        debug: process.env.DEBUG
    })
}