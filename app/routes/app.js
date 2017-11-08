import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { inject: { service } } = Ember;
export default Ember.Route.extend(AuthenticatedRouteMixin, {

  currentUser: service('current-user'),

  planObserver: Ember.observer('currentUser.teamPlan', function() {
    if (!this.get('currentUser.onTrial') && !this.get('currentUser.teamPlan')) {
      this.transitionTo('choose-plan');
    }
  }),

  beforeModel() {
    this.get('planObserver');
  }
});
