import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';
import ValidationErrors from '../constants/errors';

const Validations = buildValidations({
  newProjectName: validator('presence', {
    presence: true,
    message: ValidationErrors.presenceError,
    description: 'Project name'
  }),
});

export default Ember.Component.extend(Validations, {

  isAddingNewProject: false,
  newProjectName: null,
  tagName:'',

  actions: {
    saveButtonPressed() {
      this.set('showErrors', true);
      const errors = this.get('validations.messages');
      if (errors.length === 0) {
        let result = Ember.RSVP.defer();
        this.get('onSave')(this.get('newProjectName'), result);
        return result.promise.then(() => {
          this.set('newProjectName', null);
        })
      } else {
        return Ember.RSVP.reject();
      }
    },
    toggleIsAddingNewProject() {
      this.toggleProperty('isAddingNewProject')
    },
  }
});
