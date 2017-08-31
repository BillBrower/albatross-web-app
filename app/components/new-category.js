import Ember from 'ember';

import { validator, buildValidations } from 'ember-cp-validations';
import ValidationErrors from '../constants/errors';

const Validations = buildValidations({
  newCategoryName: validator('presence', {
    presence: true,
    message: ValidationErrors.presenceError,
    description: 'Category name'
  }),
});

export default Ember.Component.extend(Validations, {

  newCategoryName: null,

  actions: {
    saveButtonPressed() {
      this.set('showErrors', true);
      const errors = this.get('validations.messages');
      if (errors.length === 0) {
        let result = Ember.RSVP.defer();
        this.get('onSave')(this.get('newCategoryName'), result);
        return result.promise.then(() => {
          this.set('newCategoryName', null);
          this.send('toggleIsAddingNewCategory');
        })
      } else {
        return Ember.RSVP.reject();
      }
    },
    toggleIsAddingNewCategory() {
      this.toggleProperty('isAddingNewCategory')
    },
  }
});
