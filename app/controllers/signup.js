import Ember from 'ember';
import {buildValidations, validator} from "ember-cp-validations";
import ValidationErrors from '../constants/errors';

const Validations = buildValidations({
  teamName: validator('presence', {
    presence: true,
    message: ValidationErrors.presenceError,
    description: 'Team name'
  }),

  firstName: validator('presence', {
    presence: true,
    message: ValidationErrors.presenceError,
    description: 'First name'
  }),

  lastName: validator('presence', {
    presence: true,
    message: ValidationErrors.presenceError,
    description: 'Last name'
  }),

  emailAddress: [
    validator('presence', {
      presence: true,
      message: ValidationErrors.presenceError,
      description: 'Team name'
    }),
    validator('format', {
      type: 'email',
      message: 'Invalid format',
    })
  ],
  password: [
    validator('presence', {
      presence: true,
      message: ValidationErrors.presenceError,
      description: 'Password'
    }),
    validator('length', {
      min: 8,
      message: 'Your password must be at least 8 characters.'
    }),
  ]
});

export default Ember.Controller.extend(Validations, {

  actions: {
    signupButtonPressed() {
      this.set('errors', null);

      const errors = this.get('validations.messages');

      this.set('showError', true);
      if (errors.length > 0) {
        return Ember.RSVP.reject();
      } else {
        const result = Ember.RSVP.defer();
        const teamName = this.get('teamName');
        const firstName = this.get('firstName');
        const lastName = this.get('lastName');
        const emailAddress = this.get('emailAddress');
        const password = this.get('password');

        const user = this.get('store').createRecord('user',{
          firstName: firstName,
          lastName: lastName,
          email: emailAddress,
          password: password,
        });

        this.send('signup', user, teamName, result);
        return result.promise;
      }
    }
  }
});
