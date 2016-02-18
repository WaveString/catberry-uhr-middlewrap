require('babel-core/register');
require("babel-polyfill");

var mocker = require('./lib/mocker.js');

module.exports = mocker;
