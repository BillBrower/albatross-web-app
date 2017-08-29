import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';
import ENV from 'albatross-web-app/config/environment';

export default Base.extend({
  restore(data) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      if (!Ember.isEmpty(data.token)) {
        resolve(data);
      } else {
        reject();
      }
    });
  },

  authenticate(username, password) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax({
        url: ENV.host + 'api/v1/login/',
        type: 'POST',
        data: JSON.stringify({
          username: username,
          password: password
        }),
        headers: {
          'Accept':'application/vnd.api+json'
        },
        contentType: 'application/vnd.api+json',
        dataType: 'json',
      }).then((response) => {
        Ember.run(function() {
          resolve({
            token: response.token
          });
        });
      }, (xhr) => {
        var response = xhr.responseText;
        Ember.run(function() {
          reject(response);
        });
      });
    });
  },
});
