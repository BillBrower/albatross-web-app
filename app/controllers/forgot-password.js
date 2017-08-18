import Ember from 'ember';
const { RSVP } = Ember;
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  email: validator('format', {
    type: 'email',
    message: 'Email Address is not valid.'
  })
});

export default Ember.Controller.extend(Validations, {

  email: null,

  actions: {

    submitButtonPressed() {
      this.set('errors', null);

      const email = this.get('email');
      const result = RSVP.defer();
      const errors = this.get('validations.messages');
      this.set('showError', true);
      if (errors.length > 0) {
        Ember.RSVP.reject();
      } else {
        this.send('sendResetEmail', email, result);
      }

      return result.promise;
    }
  }
});
