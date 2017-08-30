import DS from 'ember-data';
import {buildValidations, validator} from "ember-cp-validations";
import ValidationErrors from "../constants/errors";
const {attr, Model, belongsTo} = DS;

const Validations = buildValidations({
  actual: validator('presence', {
    presence: true,
    message: ValidationErrors.presenceError,
    description: 'Actual'
  }),
  estimated: validator('presence', {
    presence: true,
    message: ValidationErrors.presenceError,
    description: 'Estimated'
  }),
  description: validator('presence', {
    presence: true,
    message: ValidationErrors.presenceError,
    description: 'Description'
  })
});

export default Model.extend(Validations, {

  actual: attr('number'),
  description: attr('string'),
  estimated: attr('number'),

  category: belongsTo('category'),

});
