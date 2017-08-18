import Ember from 'ember';
import ENV from 'albatross-web-app/config/environment';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import Errors from "../constants/errors";

export default Ember.Route.extend(UnauthenticatedRouteMixin, {

  routeIfAlreadyAuthenticated: ENV.routeAfterAuthentication,

  actions: {
    sendResetEmail(email, result) {
      const url = ENV.host + '/reset_password';
      const data = {
        'email_address': email
      };
      Ember.$.ajax({
        contentType: 'application/json',
        data: JSON.stringify(data),
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
