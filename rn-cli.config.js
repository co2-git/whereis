var blacklist = require('react-native/packager/blacklist');

var config = {
  getBlacklistRE() {
    return blacklist([
      /releases\/.*/
    ]);
  }
};

module.exports = config;
