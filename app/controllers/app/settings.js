import Ember from 'ember';
import ENV from 'albatross-web-app/config/environment';

export default Ember.Controller.extend({

  session: Ember.inject.service(),
  password: null,
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
            const headers = { 'Accept': 'application/vnd.api+json' };
            headers[headerName] = headerValue;
            Ember.$.ajax({
              url: `${ENV.host}/api/v1/users/`,
              type: 'PATCH',
              data: JSON.stringify(json),
              headers: headers,
              contentType: 'application/vnd.api+json',
              dataType: 'json',
            }).then(() => {
              this.set('accountErrors', null);
              result.resolve();
            }).catch((response) => {
              this.set('accountErrors', Errors.mapResponseErrors(response));
              result.reject();
            });
          });

        return result.promise;
      }
    },

    resetPasswordButtonPressed() {

    }
  }
});
