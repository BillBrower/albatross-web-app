import Ember from 'ember';

export default Ember.Component.extend({
  debounceWait: 1000,
  fireAtStart: true,
  save() {
    this.get('saveValue')(this.get("value"));
  },

  actions: {
    inputChanged(event) {
      this.set('value', event.target.value);
      Ember.run.throttle(this, "save", this.debounceWait, this.fireAtStart);
    },
  }
});
