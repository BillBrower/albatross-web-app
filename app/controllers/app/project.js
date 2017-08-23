import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    saveActual(id, value) {
      console.log('Actual- id: ' + id + ' value: ' + value);
    },
    saveDescription(id, value) {
      console.log('Description- id: ' + id + ' value: ' + value);
    },
    saveEstimated(id, value) {
      console.log('Estimated- id: ' + id + ' value: ' + value);
    },
  }

});
