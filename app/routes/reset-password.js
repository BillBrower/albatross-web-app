import Ember from 'ember';
import ENV from 'albatross-web-app/config/environment';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import Errors from "../constants/errors";

export default Ember.Route.extend(UnauthenticatedRouteMixin, {

  routeIfAlreadyAuthenticated: ENV.routeAfterAuthentication,

  model(params) {
    return {
      token: params.token
    };
  },

  actions: {
    resetPassword(token, password, result) {
      const url = ENV.host + '/api/v1/password/reset/confirm/';
      let data = {
        new_password1: password,
        new_password2: password,
        token: token
      };
      Ember.$.ajax({
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
        url: url,
        method: 'POST'
      }).then(() => {
        this.transitionTo('reset-password-success');
      }).catch((response) => {
        result.reject();
        this.controller.set('errors', Errors.mapResponseErrors(response));
      });
    }
  }
});
