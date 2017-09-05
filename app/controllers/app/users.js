import Ember from 'ember';
import {buildValidations, validator} from "ember-cp-validations";
import Errors from '../../constants/errors';
import ENV from 'albatross-web-app/config/environment';

const Validations = buildValidations({

  emailAddress: [
    validator('presence', {
      presence: true,
      message: Errors.presenceError,
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
  session: Ember.inject.service('session'),
  sortedInvitations: Ember.computed.sort('model.invitations.content', 'sortInvitationDefinition'),
  sortedUsers: Ember.computed.sort('model.users.content', 'sortUserDefinition'),
  sortInvitationDefinition: ['email'],
  sortUserDefinition: ['dateJoined:desc'],

  actions: {
    inviteButtonPressed() {
      this.set('showErrors', true);
      if (this.get('validations.isValid')) {
        const email = this.get('emailAddress');
        const data = {
              email: email
        };
        const teamId = this.get('model.id');
        this.get('session')
          .authorize('authorizer:django-token-authorizer', (headerName, headerValue) => {
            const headers = { 'Accept': 'application/vnd.api+json' };
            headers[headerName] = headerValue;
              Ember.$.ajax({
                url: `${ENV.host}/api/v1/teams/${teamId}/invite-user/`,
                type: 'POST',
                data: JSON.stringify(data),
                headers: headers,
                contentType: 'application/json',
                dataType: 'json',
              }).then(() => {
                debugger;
                this.set('emailAddress', null);
                this.get('model').reload();
                return Ember.RSVP.resolve();
              }).catch((response) => {
                this.set('errors', Errors.mapResponseErrors(response));
                return Ember.RSVP.reject();

              });
            });
      } else {
        return Ember.RSVP.reject();
      }

    }
  }
});
