import DS from 'ember-data';
import {buildValidations, validator} from "ember-cp-validations";
import ValidationErrors from "../constants/errors";
const {attr, Model, belongsTo, hasMany} = DS;

const Validations = buildValidations({
  name: validator('presence', {
    presence: true,
    message: ValidationErrors.presenceError,
    description: 'Name'
  })
});

export default Model.extend(Validations, {

  actual: attr('number'),
  buffer: attr('number'),
  estimated: attr('number'),
  name: attr('string'),
  updatedAt: attr('date'),

  categories: hasMany('category')
});
