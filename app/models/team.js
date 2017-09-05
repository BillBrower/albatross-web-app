import DS from 'ember-data';
import Ember from 'ember';
import {buildValidations, validator} from "ember-cp-validations";
import ValidationErrors from "../constants/errors";
const {attr, Model, hasMany, PromiseObject} = DS;

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
    const memberships = this.get('memberships');
    const promise = Ember.RSVP.all(memberships.map((membership) => {
      return membership.get('user')
    })).then((users) => {
      return users.filter((user) => {
        return user !== null;
      })
    });

    return PromiseObject.create({
      promise: promise
    });
  }),
  invitations: Ember.computed('memberships.[]', function() {
    const memberships = this.get('memberships');
    const promise = Ember.RSVP.all(memberships.map((membership) => {
      return membership.get('invitation')
    })).then((invitations) => {
      return invitations.filter((invitation) => {
        return invitation !== null;
      })
    });

    return PromiseObject.create({
      promise: promise
    });
  })
});
