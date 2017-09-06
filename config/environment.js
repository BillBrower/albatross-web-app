/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'albatross-web-app',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    clientId: 'MUkImBIB0GpBkplwGweuL7mEGzjqmvcYX2mJumNX',
    clientSecret: 'Iidg9RnNY1LYyxCVDdUt9INgGqZtvzrnJPNx95TQ',
    routeAfterAuthentication: '/app/projects',

    contentSecurityPolicy: {
      'script-src': "'self' 'unsafe-eval' https://*.googleapis.com https://*.gstatic.com",
      'img-src': "'self' https://*.googleapis.com https://*.gstatic.com",
      'font-src': "'self' https://*.gstatic.com",
      'style-src': "'self' 'unsafe-inline' https://*.googleapis.com"
    },
  };

  if (environment === 'local') {
    ENV.host = 'http://127.0.0.1:8000'
  }

  if (environment === 'development') {
    ENV.host = 'https://getalbatross.com'
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.host = 'https://getalbatross.com'
  }

  return ENV;
};
