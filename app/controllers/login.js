import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';
import ValidationErrors from '../constants/errors';

const Validations = buildValidations({
  email: validator('presence', {
    presence: true,
    message: ValidationErrors.presenceError,
    description: 'Email Address'
  }),

  password: validator('presence', {
    presence: true,
    message: ValidationErrors.presenceError,
    description: 'Password'
  }),

});
export default Ember.Controller.extend(Validations, {

  email: null,
  password: null,

  actions: {
    loginButtonPressed() {
      this.set('errors', null);

      const email = this.get('email');
      const password = this.get('password');
      const errors = this.get('validations.messages');

      this.set('showError', true);
      if (errors.length > 0) {
        return Ember.RSVP.reject();
      } else {
        const result = Ember.RSVP.defer();
        this.send('login', email, password, result);
        return result.promise;
      }
    }
  }
});
