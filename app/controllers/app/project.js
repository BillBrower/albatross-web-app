import Ember from 'ember';

export default Ember.Controller.extend({

  hasCategories: Ember.computed('model.categories', function() {
    return this.get('model.categories').then((categories) => {
      return categories.length > 0
    })
  }),
  isShowingToggleModal: false,

  saveItem(item) {
    if (item.get('validations.isValid')) {
      item.save();
    }
  },
  actions: {
    addNewCategory(categoryName, result) {
      this.get('store').createRecord('category', {
        name: categoryName,
        project: this.get('model')
      }).save()
        .then((category) => {
        this.get('store').createRecord('item', {
          category: category
        });
          result.resolve()
        }).catch((response) => {
          result.reject(response)
      })
    },

    addNewItem(categoryId) {
      const category = this.get('store').peekRecord('category', categoryId);
      this.get('store').createRecord('item', {
        category: category
      });
    },
    onBufferChanged(value) {
      const model = this.get('model');
      model.set('buffer', parseInt(value));
      model.save()
        .catch(() => {
          //TODO: Show error
        });
    },
    saveActual(item, value) {
      item.set('actual', value);
      this.saveItem(item);
    },
    saveDescription(item, value) {
      item.set('description', value);
     this.saveItem(item);
    },
    saveEstimated(item, value) {
      item.set('estimated', value);
      this.saveItem(item);
    },
    toggleIsShowingTogglModal() {
      this.toggleProperty('isShowingTogglModal');
    }
  }

});
