import DS from 'ember-data';
import {buildValidations, validator} from "ember-cp-validations";
import ValidationErrors from "../constants/errors";
const {attr, Model, hasMany} = DS;

const Validations = buildValidations({
  name: validator('presence', {
    presence: true,
    message: ValidationErrors.presenceError,
    description: 'Name'
  })
});

export default Model.extend(Validations, {

  actual: attr('number', {serialize: false}),
  archived: attr('boolean'),
  buffer: attr('number', {defaultValue: 0}),
  estimated: attr('number', {serialize: false}),
  name: attr('string'),
  updatedAt: attr('date'),

  categories: hasMany('category')
});
