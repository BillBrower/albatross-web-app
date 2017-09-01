import DS from 'ember-data';
import Ember from 'ember';
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
  name: attr('string'),

  memberships: hasMany('membership', { async: false }),
  users: Ember.computed('memberships.[]', function() {
    let users = []
    const memberships = this.get('memberships');
    memberships.forEach((membership) => {
      users.push(membership.get('user'))
    });
    return users;
  })
});
