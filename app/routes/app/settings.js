import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Route.extend({

  currentUser: service('current-user'),

  model() {
    return this.get('currentUser.user')
  }
});
