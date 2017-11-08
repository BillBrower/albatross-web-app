import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { inject: { service } } = Ember;
export default Ember.Route.extend(AuthenticatedRouteMixin, {

  session: service(),

  actions: {
    logout() {
      this.get('session').invalidate();
      this.get('segment').trackEvent('Logged out');
    },
  }
});
