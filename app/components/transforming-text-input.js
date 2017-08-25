import Ember from 'ember';

export default Ember.Component.extend({

  isActive: false,

  actions: {
    cancel() {
      this.set('isActive', false);
    },

    makeActive() {
      this.set('isActive', true);
    }
  }
});
