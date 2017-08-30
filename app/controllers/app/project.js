import Ember from 'ember';
import Errors from '../../constants/errors';

export default Ember.Controller.extend({

  isEmpty: Ember.computed('model.actual', 'model.estimated', function() {
    return this.get('model.actual') === 0 && this.get('model.estimated') === 0;
  }),
  hasCategories: Ember.computed('model.categories', function() {
    return this.get('model.categories').then((categories) => {
      return categories.length > 0
    })
  }),
  isShowingToggleModal: false,

  saveItem(item) {
    if (item.get('validations.isValid')) {
      item.save().then(() => {
        this.get('model').reload();
        this.get('store').findRecord('category', item.get('category.id'));
      });
    }
  },
  actions: {
    addNewCategory(categoryName, result) {
      const category = this.get('store').createRecord('category', {
        name: categoryName,
        project: this.get('model')
      });
        category.save()
        .then((category) => {
        this.get('store').createRecord('item', {
          category: category
        });
          result.resolve()
        }).catch((response) => {
          category.rollbackAttributes();
          result.reject(Errors.mapResponseErrors(response))
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
    saveName(model, result) {
      model.save().then(() =>{
        result.resolve();
      }).catch((response) => {
        result.reject(response);
      });
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
