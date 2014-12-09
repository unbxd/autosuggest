
var settings = require("./../settings");
CONFIG = { "test":"test"};
for(var key in settings) {
  if(settings.hasOwnProperty(key)) {
    CONFIG[key] = settings[key];
  }
}

/**
 * Paths
 */
UTILS_DIR = __dirname + '/';
CLIENTS_DIR = __dirname + '/../clients/';

