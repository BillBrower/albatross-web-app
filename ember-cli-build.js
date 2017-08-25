/* eslint-env node */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {

  let env = EmberApp.env() || 'development';

  let fingerprintOptions = {
    enabled: true,
    extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'svg', 'ico']
  };

  switch (env) {
    case 'development':
      fingerprintOptions.prepend = 'http://localhost:4200/';
      break;
    case 'staging':
      fingerprintOptions.prepend = 'https://s3.amazonaws.com/albatross.web.app.assets/';
      break;
    case 'production':
      fingerprintOptions.prepend = 'https://s3.amazonaws.com/albatross.web.app.assets/';
      break;
  }

  let app = new EmberApp(defaults, {
    fingerprint: fingerprintOptions
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('bower_components/flexboxgrid/dist/flexboxgrid.css');

  return app.toTree();
};
