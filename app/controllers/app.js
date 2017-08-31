import Ember from 'ember';

export default Ember.Controller.extend({

  currentUser: Ember.inject.service('current-user'),
  isShowingMenu: false,
  session: Ember.inject.service(),

  actions: {
    logout() {
      this.get('session').invalidate();
    },
    toggleIsShowingMenu() {
      this.toggleProperty('isShowingMenu');
    }
  }
});
