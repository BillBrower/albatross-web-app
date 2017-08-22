import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import Ember from 'ember';
import ENV from 'albatross-web-app/config/environment';
import JSONAPIAdapter from 'ember-data/adapters/json-api';

export default JSONAPIAdapter.extend(DataAdapterMixin, {
  host: ENV.host,

  authorizer: 'authorizer:oauth2',

  pathForType: function(type) {
    var plural = Ember.String.pluralize(type);
    return Ember.String.underscore(plural);
  }
});
