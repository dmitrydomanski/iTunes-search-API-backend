require('babel-register')({
    presets: [ 'env' ]
})

module.exports = require('./src/lib/server').start();

// require('./src/lib/server').start();