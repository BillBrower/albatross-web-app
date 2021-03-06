import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import Ember from 'ember';
import ENV from 'albatross-web-app/config/environment';
import JSONAPIAdapter from 'ember-data/adapters/json-api';

export default JSONAPIAdapter.extend(DataAdapterMixin, {
  host: ENV.host,
  namespace: 'api/v1',
  isInvalid(status) {
    return status === 422 || status === 400;
  },
  authorizer: 'authorizer:django-token-authorizer',

  pathForType: function(type) {
    var plural = Ember.String.pluralize(type);
    return Ember.String.underscore(plural);
  },

  buildURL: function(type, id, record) {
    //call the default buildURL and then append a slash
    return this._super(type, id, record) + '/';
  }
});
