import Ember from 'ember';

export default Ember.Route.extend({

  currentUser: Ember.inject.service('current-user'),

  model() {
    const user = this.get('currentUser.user');
    return user.get('membership').then((membership) => {
      if (membership) {
        return membership.get('team').then((team) => {
          return this.get('store').findRecord('team', team.get('id'));
        });
      }
    });
  }
});
