import Ember from 'ember';
import Errors from '../../constants/errors';
import ENV from 'albatross-web-app/config/environment';

export default Ember.Controller.extend({

  notifications: Ember.inject.service('notification-messages'),
  session: Ember.inject.service(),
  setupNotifications: function () {
    this.get('notifications').setDefaultClearDuration(1200);
  }.observes('notifications').on('init'),
  toggleToken: null,

  actions: {
    saveAccountButtonPressed() {
      this.set('showError', true);
      if ((!this.get('model.validations.isValid') )) {
        return Ember.RSVP.reject()
      } else {
        let json = this.get('model').serialize();
        json.data.id = this.get('model').get('id');
        delete json.data.attributes.password;
        const result = Ember.RSVP.defer();
        this.get('session')
          .authorize('authorizer:django-token-authorizer', (headerName, headerValue) => {
            const headers = {'Accept': 'application/vnd.api+json'};
            headers[headerName] = headerValue;
            Ember.$.ajax({
              url: `${ENV.host}/api/v1/users/`,
              type: 'PATCH',
              data: JSON.stringify(json),
              headers: headers,
              contentType: 'application/vnd.api+json',
              dataType: 'json',
            }).then(() => {
              this.get('model.profile').then((profile) => {
                if (profile.get('hasDirtyAttributes')) {
                  let profileJson = profile.serialize();
                  profileJson.data.id = profile.get('id');
                  Ember.$.ajax({
                    url: `${ENV.host}/api/v1/users/${this.get('model.id')}/profile/`,
                    type: 'PATCH',
                    data: JSON.stringify(profileJson),
                    headers: headers,
                    contentType: 'application/vnd.api+json',
                    dataType: 'json',
                  }).then(() => {
                    this.set('accountErrors', null);
                    this.get('notifications').success("Account information saved successfully!", {
                      cssClasses: 'notification',
                      autoClear: true,
                    });
                    result.resolve();
                  }).catch((response) => {
                    this.set('accountErrors', Errors.mapResponseErrors(response));
                    result.reject();
                  })
                } else {
                  this.set('accountErrors', null);
                  this.get('notifications').success("Account information saved successfully!", {
                    cssClasses: 'notification',
                    autoClear: true,
                  });
                  result.resolve();
                }
              })
            }).catch((response) => {
              debugger
              this.set('accountErrors', Errors.mapResponseErrors(response));
              result.reject();
            });
          });

        return result.promise;
      }
    },

    changePasswordButtonPressed() {
      let data = {
        new_password1: this.get('newPassword'),
        new_password2: this.get('newPassword'),
        old_password: this.get('currentPassword')
      };
      const result = Ember.RSVP.defer();
      this.get('session')
        .authorize('authorizer:django-token-authorizer', (headerName, headerValue) => {
          const headers = {'Accept': 'application/json'};
          headers[headerName] = headerValue;
          Ember.$.ajax({
            url: `${ENV.host}/api/v1/password/change/`,
            type: 'POST',
            data: JSON.stringify(data),
            headers: headers,
            contentType: 'application/json',
            dataType: 'json',
          }).then(() => {
            this.set('passwordErrors', null);
            this.get('notifications').success("Password changed successfully!", {
              cssClasses: 'notification',
              autoClear: true,
            });
            result.resolve();
          }).catch((response) => {
            const detail = Errors.mapResponseErrors(response);
            const errors = detail[0] === 'Invalid password' ? ['The current password you entered is not correct. Please try again'] : detail
            this.set('passwordErrors', errors);
            result.reject();
          });
        });

      return result.promise;
    }
  }
});
