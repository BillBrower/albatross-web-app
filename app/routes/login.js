import Ember from 'ember';
import ENV from 'albatross-web-app/config/environment';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {

  routeIfAlreadyAuthenticated: ENV.routeAfterAuthentication,

  actions: {
    login(email, password, result) {
      this.get('session')
        .authenticate('authenticator:django-rest-authenticator', email, password)
        .catch(() => {
          this.controller.set('errors', ["Your username and password combination is not correct. Please try again."]);
         result.reject();
        });
    }
  }
});

