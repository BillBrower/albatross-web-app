import DS from 'ember-data';
import {buildValidations, validator} from "ember-cp-validations";
import ValidationErrors from "../constants/errors";

const {attr, Model, belongsTo} = DS;

const Validations = buildValidations({
  actual: [
    validator('number', {
      allowString: true,
      integer: false,
      gte: 0,
    }),
    validator('presence', {
      presence: true,
      message: ValidationErrors.presenceError,
      description: 'Actual'
    })],
  estimated: [
    validator('number', {
      allowString: true,
      integer: false,
      gte: 0,
    }), validator('presence', {
      presence: true,
      message: ValidationErrors.presenceError,
      description: 'Estimated'
    })],
  description: validator('presence', {
    presence: true,
    message: ValidationErrors.presenceError,
    description: 'Description'
  })
});

export default Model.extend(Validations, {

  actual: attr('number', {defaultValue: 0}),
  createdAt: attr('date', {serialize: false}),
  description: attr('string'),
  estimated: attr('number', {defaultValue: 0}),

  category: belongsTo('category'),

});
