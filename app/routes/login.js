import Ember from 'ember';
import ENV from 'albatross-web-app/config/environment';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
const { inject: { service } } = Ember;

export default Ember.Route.extend(UnauthenticatedRouteMixin, {

  routeIfAlreadyAuthenticated: ENV.routeAfterAuthentication,
  segment: Ember.inject.service(),

  beforeModel() {
    this._super(...arguments);
    window.scrollTo(0,0);
  },

  actions: {
    login(email, password, result) {
      this.get('session')
        .authenticate('authenticator:django-rest-authenticator', email, password)
        .then(() => {
          this.get('segment').trackEvent('Logged in');
        })
        .catch(() => {
          this.controller.set('errors', ["Your username and password combination is not correct. Please try again."]);
         result.reject();
        });
    }
  }
});

