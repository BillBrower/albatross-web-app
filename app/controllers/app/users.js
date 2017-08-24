import Ember from 'ember';
import {buildValidations, validator} from "ember-cp-validations";
import ValidationErrors from '../../constants/errors';

const Validations = buildValidations({

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
  ]
});

export default Ember.Controller.extend(Validations, {

  emailAddress: null,

  actions: {
    inviteButtonPressed() {
      this.set('showErrors', true);
      if (this.get('validations.isValid')) {
        //TODO: Invite user
        this.set('emailAddress', null);
        return Ember.RSVP.resolve();
      } else {
        return Ember.RSVP.reject();
      }

    }
  }
});
