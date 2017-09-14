import Ember from 'ember';
import ENV from 'albatross-web-app/config/environment';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
const { inject: {service}, testing } = Ember;

export default Ember.Route.extend(ApplicationRouteMixin,{

  currentUser: service('current-user'),
  routeAfterAuthentication: ENV.routeAfterAuthentication,
  segment: Ember.inject.service(),

  beforeModel(transition) {
    this._super(transition);
    return this._loadCurrentUser();
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentUser();
  },

  sessionInvalidated() {
    if (!testing) {
      window.location.replace('/login');
    }
  },

  identifyUser: function() {
    if (this.get('currentUser')) {
      this.get('segment').identifyUser(this.get('currentUser.user.id'), this.get('currentUser.user'));
    }
  },

  _loadCurrentUser() {
    if (!this.get('currentUser')) {
      this.get('session').invalidate();
    }
    return this.get('currentUser').load().catch(() => {
        if (this.get('session.isAuthenticated')) {
          this.get('session').invalidate()
        }
      }
    );
  }
});
