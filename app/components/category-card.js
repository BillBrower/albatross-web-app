import Ember from 'ember';

export default Ember.Component.extend({

  isEmpty: Ember.computed('model.items', 'model.items.@each.isNew', function() {
    if (this.get('model.items.length') < 1) {
      console.log("one");
      return true;
    } else {
      if (this.get('model.items.firstObject.isNew')) {
        console.log("two");
        return true;
      } else {
        console.log("three");
        return false;
      }
    }
  }),
  sortedItems: Ember.computed.sort('model.items', 'sortDefinition'),
  sortDefinition: ['isNew','description'],
  tagName:''
});
