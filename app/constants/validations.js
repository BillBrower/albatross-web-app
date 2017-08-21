import ValidationErrors from './errors';
import {validator} from 'ember-cp-validations';

const password = {
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
  ],
  confirmPassword: validator('confirmation', {
    on: 'password',
    message: 'Passwords do not match.'
  })
}

export default {
  Password: password
}
