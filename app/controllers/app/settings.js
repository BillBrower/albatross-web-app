import Ember from 'ember';
import Error from '../../constants/errors';
import {buildValidations, validator} from "ember-cp-validations";
import ValidationErrors from '../../constants/errors';

const Validations = buildValidations({
  teamToken: validator('presence', {
    presence: true,
    message: ValidationErrors.presenceError,
    description: 'Team name'
  }),
  password: [
    validator('presence', {
      presence: true,
      message: ValidationErrors.presenceError,
      description: 'Password'
    }),
    validator('length', {
      min: 8,
      message: 'Your password must be at least 8 characters.'
    })
  ]
});

export default Ember.Controller.extend(Validations, {

  password: null,
  toggleToken: null,

  actions: {
    saveAccountButtonPressed() {
      this.set('showError', true);
      if ((!this.get('validations.attrs.password.isValid') && this.get('password') || !this.get('model.validations.isValid'))) {
        return Ember.RSVP.reject()
      } else {
        return this.get('model').save()
          .then(() => {
          this.set('accountErrors', null);
          })
          .catch((response) => {
          this.set('accountErrors', Error.mapResponseErrors(response))
          });
      }
    },
  }
});
