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
    ENV.host = 'http://127.0.0.1:8000';

    ENV.stripe = {
      publishableKey: 'pk_test_xBKNwc9sDb5owErq1QkZa5I3'
    };
    ENV['segment'] = {
      LOG_EVENT_TRACKING: false
    };
  }

  if (environment === 'development') {
    ENV.host = 'https://app.getalbatross.com';
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.stripe = {
      publishableKey: 'pk_test_xBKNwc9sDb5owErq1QkZa5I3'
    };
    ENV['segment'] = {
      LOG_EVENT_TRACKING: false
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV.stripe = {
      publishableKey: 'pk_test_xBKNwc9sDb5owErq1QkZa5I3'
    };

    ENV['segment'] = {
      LOG_EVENT_TRACKING: false
    };
  }

  if (environment === 'production') {
    ENV.host = 'https://app.getalbatross.com';

    ENV.stripe = {
      publishableKey: 'pk_live_87oq6twA9gogA0U1aihJCxc3'
    };

    ENV['segment'] = {
      WRITE_KEY: 'Zd2UrFYRkJXe5dd9MWp9nhB7dW1dTXUX',
      LOG_EVENT_TRACKING: true
    };
  }



  return ENV;
};
