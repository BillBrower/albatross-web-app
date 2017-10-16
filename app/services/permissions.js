import Ember from 'ember';
const { inject: { service }} = Ember;

export default Ember.Service.extend({

  currentUser: Ember.inject.service('current-user'),
  needsToUpgrade: Ember.computed('currentUser', function() {
    return false;
  })
});
