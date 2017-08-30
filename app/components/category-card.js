import Ember from 'ember';

export default Ember.Component.extend({

  isEmpty: Ember.computed('model.actual', 'model.estimated', function() {
    return this.get('model.actual') === 0 && this.get('model.estimated') === 0;
  }),
  sortedItems: Ember.computed.sort('model.items', 'sortDefinition'),
  sortDefinition: ['createdAt'],
  tagName:''
});
