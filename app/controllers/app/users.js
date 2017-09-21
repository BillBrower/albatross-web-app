import Ember from 'ember';
import {buildValidations, validator} from "ember-cp-validations";
import Errors from '../../constants/errors';
import Permissions from '../../constants/permissions';
import ENV from 'albatross-web-app/config/environment';
const { inject: { service } } = Ember;

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

  currentUser: service('current-user'),
  emailAddress: null,
  notifications: Ember.inject.service('notification-messages'),
  segment: Ember.inject.service(),
  session: Ember.inject.service('session'),
  sortedInvitations: Ember.computed.sort('model.invitations.content', 'sortInvitationDefinition'),
  sortedUsers: Ember.computed.sort('model.users.content', 'sortUserDefinition'),
  sortInvitationDefinition: ['email'],
  sortUserDefinition: ['dateJoined:desc'],

  canAddUsers: Ember.computed('sortedUsers', 'currentUser', function() {
    var itemsToCheck = this.get('sortedUsers').length;
    var user = this.get('currentUser.user');
    return Permissions.canAdd(user, itemsToCheck, 'users');
  }),

  init() {
    //console.log(this.get('model'));
  },

  actions: {
    inviteButtonPressed() {
      console.log(this.get('model.name'));
      this.set('showErrors', true);
      if (this.get('validations.isValid')) {
        const email = this.get('emailAddress');
        const data = {
              email: email
        };
        const teamId = this.get('model.id');
        const result = Ember.RSVP.defer();
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
                this.set('emailAddress', null);
                this.get('model').reload();
                this.get('notifications').success("User invited successfully!", {
                  cssClasses: 'notification',
                  autoClear: true,
                });
                this.get('segment').trackEvent('Invited a new user', { inviteEmail: email });
                result.resolve();
              }).catch((response) => {
                this.set('errors', Errors.mapResponseErrors(response));
                result.reject();

              });
            });
        return result.promise;
      } else {
        return Ember.RSVP.reject();
      }

    }
  }
});
