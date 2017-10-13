import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  isDeleting: false,

  actions: {
    toggleIsDeleting() {
      this.toggleProperty('isDeleting');
    }
  }
});
