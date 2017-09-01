import Ember from 'ember';
import ENV from 'albatross-web-app/config/environment';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  routeIfAlreadyAuthenticated: ENV.routeAfterAuthentication,
});
