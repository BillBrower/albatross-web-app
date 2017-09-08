import Ember from 'ember';

export default Ember.Component.extend({

  isActive: false,

  actions: {
    cancel() {
      this.set('isActive', false);
      this.get('onCancel')();
    },

    makeActive() {
      this.set('isActive', true);
    },

    onSave() {
      const result = Ember.RSVP.defer();
      this.get('onSave')(result);
      return result.promise.then(() => {
        this.send('cancel');
      }).catch((response) => {
        //TODO: Error
      })
    }
  }
});
