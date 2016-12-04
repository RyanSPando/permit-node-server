(function (routeConfig) {

  'use strict';

  routeConfig.init = function (app) {

    // *** routes *** //
    const data = require('../routes/data');

    // *** register routes *** //
    app.use('/data', data);

  };

})(module.exports);
