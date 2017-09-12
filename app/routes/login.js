import Ember from 'ember';
import ENV from 'albatross-web-app/config/environment';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {

  routeIfAlreadyAuthenticated: ENV.routeAfterAuthentication,

  beforeModel() {
    this._super(...arguments);
    window.scrollTo(0,0);
  },

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

