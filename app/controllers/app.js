import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),

  isShowingMenu: false,

  actions: {
    logout() {
      this.get('session').invalidate();
    },
    toggleIsShowingMenu() {
      this.toggleProperty('isShowingMenu');
    }
  }
});
