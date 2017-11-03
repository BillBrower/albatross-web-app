import Ember from 'ember';

export default Ember.Component.extend({

  isEmpty: Ember.computed('model.items', 'model.items.@each.isNew', function() {

    if (this.get('model.items').filterBy('isNew', true).length > 0) {
      Ember.run.schedule("afterRender", this, function () {
        this.$('input[name=description]:last').focus();
      });
    }

    if (this.get('model.items.length') < 1) {
      return true;
    } else {
      return this.get('model.items.firstObject.isNew');
    }



  }),
  isDeleting: false,
  sortedItems: Ember.computed.sort('model.items', 'sortDefinition'),
  sortDefinition: ['createdAt'],
  //tagName:'',

  actions: {
    toggleIsDeleting() {
      this.toggleProperty('isDeleting');
    }
  }
});
