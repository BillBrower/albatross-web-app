import Ember from 'ember';

const { inject: { service } } = Ember;

import { validator, buildValidations } from 'ember-cp-validations';
import ValidationErrors from '../../constants/errors';

const Validations = buildValidations({
  newProjectName: validator('presence', {
    presence: true,
    message: ValidationErrors.presenceError,
    description: 'Project name'
  }),
});

export default Ember.Controller.extend(Validations,{

  currentUser: service('current-user'),
  newProjectName: null,
  isAddingNewProject: false,

  actions: {
    saveButtonPressed() {
      this.set('showErrors', true);
      const errors = this.get('validations.messages');
      if (errors.length === 0) {
        let result = Ember.RSVP.defer();
        this.send('createProject', this.get('newProjectName'), result);
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
