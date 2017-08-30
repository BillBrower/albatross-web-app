import Ember from 'ember';
import ENV from 'albatross-web-app/config/environment';

const { inject: { service }, isEmpty, RSVP } = Ember;

export default Ember.Service.extend({
  session: service(),
  store: service(),

  load() {
    return Ember.$.ajax({
      url: ENV.host + '/api/v1/users/',
      type: 'GET',
      headers: {
        'Accept':'application/vnd.api+json'
      },
      contentType: 'application/vnd.api+json',
      dataType: 'json',
    }).then((response) => {
      const id = response['data']['id'];
      this.get('store').pushPayload(response);
      const user = this.get('store').peekRecord('user', id);
      if (user) {
        this.set('user', user);
      }
    }).catch((error) => {
      this.get('session').invalidate();
    })
  },

  logout() {
    this.get('session').invalidate();
  }
});
