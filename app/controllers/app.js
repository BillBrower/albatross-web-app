import Ember from 'ember';
const { inject: { service } } = Ember;

export default Ember.Controller.extend({

  currentUser: Ember.inject.service('current-user'),
  isShowingMenu: false,
  segment: Ember.inject.service(),
  session: Ember.inject.service(),
  teamName: Ember.computed('currentUser', function() {
    if (this.get('currentUser.user')) {
      const user = this.get('currentUser.user');
      const team = this.get('currentUser.user').get('membership').then((membership) => {
        if (membership) {
          membership.get('team').then((team) => {
            this.set('teamName', team.get('name'));
            console.log(team.get('name'));
          });
        }
      });
    }
  }),

  init() {
    this._super(...arguments);

    if (this.get('currentUser.user')) {
      const user = this.get('currentUser.user');
      const team = this.get('currentUser.user').get('membership').then((membership) => {
        if (membership) {
          membership.get('team').then((team) => {
            this.set('teamName', team.get('name'));
          });
        }
      });
    }
  },

  actions: {
    logout() {
      this.get('session').invalidate();
      this.get('segment').trackEvent('Logged out');
    },
    toggleIsShowingMenu() {
      this.toggleProperty('isShowingMenu');
    }
  }
});
