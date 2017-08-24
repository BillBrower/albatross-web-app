import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Route.extend({

  currentUser: service('current-user'),

  model() {
    //TODO: Remove once auth is setup
    //return this.get('currentUser.user')
  }
});
