import Ember from 'ember';

export default Ember.Controller.extend({

  //TODO: Use numbers from model
  actual: 92,
  buffer: 0,
  estimated: Ember.computed('buffer', function() {
    return Math.round((this.get('buffer') / 100) * this.get('originalEstimated')) + this.get('originalEstimated');
  }),
  originalEstimated: 137,

  actions: {
    addNewCategory(categoryName, result) {
      //TODO: Save category
      result.resolve();
    },
    onBufferChanged(value) {
      this.set('buffer', parseInt(value));
    },
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
