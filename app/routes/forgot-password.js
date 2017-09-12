import Ember from 'ember';
import ENV from 'albatross-web-app/config/environment';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import Errors from "../constants/errors";

export default Ember.Route.extend(UnauthenticatedRouteMixin, {

  routeIfAlreadyAuthenticated: ENV.routeAfterAuthentication,

  beforeModel() {
    this._super(...arguments);
    window.scrollTo(0,0);
  },

  actions: {
    sendResetEmail(email, result) {
      const url = ENV.host + '/api/v1/password/reset/';
      const data = {
        'email': email
      };
      Ember.$.ajax({
        contentType: 'application/json',
        data: JSON.stringify(data),
        headers: {
          'Accept': 'application/json'
        },
        method: 'POST',
        url: url,

      })
        .then(() => {
          this.transitionTo('forgot-password-success');
        }).catch((response) => {
        result.reject();
        this.controller.set('errors', Errors.mapResponseErrors(response));
      });
    }
  }
});
