import DS from 'ember-data';
import {buildValidations, validator} from "ember-cp-validations";
import ValidationErrors from "../constants/errors";
const {attr, Model, belongsTo} = DS;

const Validations = buildValidations({
  name: validator('presence', {
    presence: true,
    message: ValidationErrors.presenceError,
    description: 'Name'
  })
});

export default Model.extend(Validations, {

  name: attr('string'),

});
