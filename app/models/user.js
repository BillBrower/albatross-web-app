import DS from 'ember-data';
import {buildValidations, validator} from "ember-cp-validations";
import ValidationErrors from "../constants/errors";
const {attr, Model, belongsTo} = DS;

const Validations = buildValidations({
  email: [
    validator('presence', {
      presence: true,
      message: ValidationErrors.presenceError,
      description: 'Email Address'
    }),
    validator('format', {
      type: 'email',
      message: 'Email Address is not valid'
    })
  ],
  firstName: validator('presence', {
    presence: true,
    message: ValidationErrors.presenceError,
    description: 'First Name'
  }),
  lastName: validator('presence', {
    presence: true,
    message: ValidationErrors.presenceError,
    description: 'Last Name'
  })
});

export default Model.extend(Validations, {

  name: Ember.computed('firstName', 'lastName', function() {
    return this.get('firstName') + ' ' + this.get('lastName');
  }),
  email: attr('string'),
  firstName: attr('string'),
  lastName: attr('string'),
  password: attr('string'),

  membership: belongsTo('membership')
});
