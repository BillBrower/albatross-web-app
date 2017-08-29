import JSONAPISerializer from 'ember-data/serializers/json-api';
import Ember from 'ember';

export default JSONAPISerializer.extend({
  keyForAttribute: function(attr) {
    return Ember.String.underscore(attr);
  },

  keyForRelationship: function(rawKey) {
    return Ember.String.underscore(rawKey);
  },

  payloadKeyFromModelName: function(name) {
    var inflector = new Ember.Inflector(Ember.Inflector.defaultRules);
    return inflector.pluralize(Ember.String.underscore(name));
  }
});
