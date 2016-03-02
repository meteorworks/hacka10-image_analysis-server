require("babel-core/register");
require('babel-polyfill');

var LavellioService = function(){
  var labellioUtil = require(__dirname + "/../lib/Labellio.js");
  return new labellioUtil();
};

module.exports=LavellioService;
