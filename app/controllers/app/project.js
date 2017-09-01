import Ember from 'ember';
import Errors from '../../constants/errors';

export default Ember.Controller.extend({

  isEmpty: Ember.computed('model.actual', 'model.estimated', function() {
    return this.get('model.actual') === 0 && this.get('model.estimated') === 0;
  }),
  isShowingToggleModal: false,
  hasCategories: Ember.computed('model.categories', function() {
    return this.get('model.categories').content.length > 0;
  }),
  notifications: Ember.inject.service('notification-messages'),
  setupNotifications: function() {
    this.get('notifications').setDefaultClearDuration(1200);
  }.observes('notifications').on('init'),
  sortedCategories: Ember.computed.sort('model.categories', 'sortDefinition'),
  sortDefinition: ['createdAt'],

  saveItem(item) {
    if (item.get('validations.isValid')) {
      item.save().then(() => {
        this.get('model').reload();
        this.get('store').findRecord('category', item.get('category.id'));
        this.get('notifications').success(item.get('description') + " saved successfully!", {
          cssClasses: 'notification',
          autoClear: true,
        });
      }).catch(() => {
        this.get('notifications').error("Failed to update item!", {
          cssClasses: 'notification error',
          autoClear: true,
        });
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
        createdAt: new Date(),
        category: category
      });
    },
    onBufferChanged(value) {
      const model = this.get('model');
      model.set('buffer', parseInt(value));
      model.save()
        .then(() => {
          this.get('notifications').success("Buffer updated successfully!", {
            cssClasses: 'notification',
            autoClear: true,
          });
        })
        .catch(() => {
          this.get('notifications').error("Buffer failed to update!", {
            cssClasses: 'notification error',
            autoClear: true,
          });
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
