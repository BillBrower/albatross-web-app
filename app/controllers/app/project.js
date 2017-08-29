import Ember from 'ember';

export default Ember.Controller.extend({

  hasCategories: Ember.computed('model.categories', function() {
    return this.get('model.categories').then((categories) => {
      return categories.length > 0
    })
  }),
  isShowingToggleModal: false,

  actions: {
    addNewCategory(categoryName, result) {
      this.get('store').createRecord('category', {
        name: categoryName,
        project: this.get('model')
      }).save()
        .then(() => {
          result.resolve()
        }).catch((response) => {
          result.reject(response)
      })
    },
    onBufferChanged(value) {
      const model = this.get('model');
      model.set('buffer', parseInt(value));
      model.save()
        .catch(() => {
          //TODO: Show error
        });
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
    toggleIsShowingTogglModal() {
      this.toggleProperty('isShowingTogglModal');
    }
  }

});
