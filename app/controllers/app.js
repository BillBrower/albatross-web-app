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

  onTrial: true,

  needsToUpgrade: Ember.computed('currentUser', 'onTrial', 'numberOfUsers', 'numberOfProjects', function () {
    var onTrial = this.get('onTrial');
    var projects = this.get('numberOfProjects');
    var users = this.get('numberOfUsers');
    var plan = 0;

    if (onTrial) {  // Free Trial
      return false;
    } else if (projects < 2 && users < 2) {  // No need for trial or plan if only 1 user and project
      return false;
    } else if (plan > 1){ // Highest plan, unlimited everything
      return false;
    } else if (plan === 1) { // Middle plan, limited users
      if (users < 6) {
        return false;
      } else {
        return true;
      }
    } else if (plan < 1) {
      if (users > 1 || projects > 1) {
        return true;
      }
    } else {
      return false;
    }
  }),

  pastLimit: Ember.computed('numberOfUsers', 'numberOfUsers', function() {
    var projects = this.get('numberOfProjects');
    var users = this.get('numberOfUsers');
    var plan = 0;

    if (plan === 1 && users > 5) {
      return users + " users, but your current plan only supports up to 5"
    } else if(plan < 1) {
      return "more than the 1 project and 1 user that the free tier supports"
    } else {
      return "more projects or users than your current plan supports";
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

    this.get('store').findAll('project').then((loadedProjects) => {
      this.set('numberOfProjects', loadedProjects.get('length'));
    });
    this.get('store').findAll('user').then((loadedUsers) => {
      this.set('numberOfUsers', loadedUsers.get('length'));
    });
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
