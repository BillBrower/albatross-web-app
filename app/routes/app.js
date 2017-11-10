import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { inject: { service } } = Ember;
export default Ember.Route.extend(AuthenticatedRouteMixin, {

  currentUser: service('current-user'),

  beforeModel() {
      this.checkPlan();
      const _this = this;
      this.addObserver('currentUser.teamPlan', function() {
        _this.checkPlan();
      });
  },

  checkPlan() {
    if (!this.get('currentUser.onTrial') && !this.get('currentUser.teamPlan')) {
      this.transitionTo('choose-plan');
    }
  }
});
