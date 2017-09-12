import Ember from 'ember';
import ENV from 'albatross-web-app/config/environment';

const { inject: { service }} = Ember;

export default Ember.Service.extend({
  session: service(),
  store: service(),

  load() {
    if (this.get('session.isAuthenticated')) {
      return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('session').authorize('authorizer:django-token-authorizer', (headerName, headerValue) => {
        const headers = {};
        headers[headerName] = headerValue;
        headers['Accept'] = 'application/vnd.api+json';
        Ember.$.ajax({
          url: ENV.host + '/api/v1/users/',
          type: 'GET',
          headers: headers,
          contentType: 'application/vnd.api+json',
          dataType: 'json',
        }).then((response) => {
          const id = response['data']['id'];
          this.get('store').pushPayload(response);
          const user = this.get('store').peekRecord('user', id);
          if (user) {
            this.set('user', user);
          }
          resolve();
        }).catch(() => {
          reject();
        })
      });
      });
    } else {
      return Ember.RSVP.reject();
    }
  },

  logout() {
    this.get('session').invalidate();
  }
});
