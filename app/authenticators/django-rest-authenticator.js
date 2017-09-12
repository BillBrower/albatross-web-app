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
        url: ENV.host + '/api/v1/login/',
        type: 'POST',
        data: JSON.stringify({
          username: username,
          password: password
        }),
        headers: {
          'Accept': 'application/json'
        },
        contentType: 'application/json',
        dataType: 'json',
      }).then((response) => {
        Ember.run(function () {
          resolve({
            token: response.key
          });
        });
      }, (xhr) => {
        var response = xhr.responseText;
        Ember.run(function () {
          reject(response);
        });
      });
    });
  },

  invalidate(data) {
    return new Ember.RSVP.Promise((resolve) => {
      const headers = {};
      headers['Authorization'] = 'Token ' + data.token;
      headers['Accept'] = 'application/json';
      Ember.$.ajax({
        url: ENV.host + '/api/v1/logout/',
        type: 'POST',
        headers: headers,
        contentType: 'application/json',
        dataType: 'json',
      }).then(() => {
        resolve();
      }).catch(() => {
        resolve();
      })
    });
  }
});
