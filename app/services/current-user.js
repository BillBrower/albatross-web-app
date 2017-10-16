import Ember from 'ember';
import ENV from 'albatross-web-app/config/environment';

const { inject: { service }} = Ember;

export default Ember.Service.extend({
  session: service(),
  store: service(),

  load() {
    if (this.get('session.isAuthenticated')) {
      return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('session').authorize('authorizer:django-token-authorizer', (headerName, headerValue) => {
        const headers = {};
        headers[headerName] = headerValue;
        headers['Accept'] = 'application/vnd.api+json';
        Ember.$.ajax({
          url: ENV.host + '/api/v1/users/',
          type: 'GET',
          headers: headers,
          contentType: 'application/vnd.api+json',
          dataType: 'json',
        }).then((response) => {
          const id = response['data']['id'];
          this.get('store').pushPayload(response);
          const user = this.get('store').peekRecord('user', id);
          if (user) {
            const teamId = user.get('membership.team.id');
            const role = user.get('membership.role');
            const team = this.get('store').findRecord('team', teamId).then((response) => {
              this.set('onTrial', response.get('onTrial'));
              this.set('teamName', response.get('name'));
            });

            if (role === 'owner') {
              this.set('isOwner', true);
            } else {
              this.set('isOwner', false);
            }
            this.set('user', user);
          }
          resolve();
        }).catch(() => {
          reject();
        })
      });
      });
    } else {
      return Ember.RSVP.reject();
    }
  },

  subscription: function () {
    if (this.get('session.isAuthenticated')) {
      return this.get('session').authorize('authorizer:django-token-authorizer', (headerName, headerValue) => {
        const headers = {};
        headers[headerName] = headerValue;
        headers['Accept'] = 'application/json';
        Ember.$.ajax({
          url: ENV.host + '/api/v1/payments/subscription/',
          type: 'GET',
          headers: headers,
          contentType: 'application/json',
          dataType: 'json',
        }).then((response) => {
          this.set('teamPlan', response.plan);
          this.set('teamPlanAmount', response.amount);
          var plan = response.plan;

          if (!this.get('onTrial')) {
            if (plan === 'freelancer-beta-monthly' || plan === 'freelancer-beta-annual') {
              this.set('maxProjects', 'unlimited');
              this.set('maxUsers', 5);
            } else if (plan === 'moonlighter-beta-monthly' || plan === 'moonlighter-beta-annual') {
              this.set('maxProjects', 'unlimited');
              this.set('maxUsers', 'unlimited');
            } else {
              this.set('maxProjects', 1);
              this.set('maxUsers', 1);
            }
          } else {
            this.set('maxProjects', 'unlimited');
            this.set('maxUsers', 'unlimited');
          }
        }).catch(() => {
        })
      });
    }
  }.observes('onTrial').on('init'),

  needsToUpgrade: Ember.computed('user', 'maxUsers', 'maxProjects', 'onTrial', function() {
    const projectsArray = this.get('store').peekAll('project');
    const usersArray = this.get('store').peekAll('user');
    const projects = projectsArray.get('length');
    const users = usersArray.get('length');
    const maxProjects = this.get('maxProjects');
    const maxUsers = this.get('maxUsers');
    const onTrial = this.get('onTrial');

    if (onTrial) {
      return false;
    } else if (maxProjects === 'unlimited' && maxUsers === 'unlimited') {
      return false;
    } else if (projects > maxProjects || users > maxUsers) {

      if (projects > maxProjects) {
        this.set('pastLimit', 'projects');
      } else {
        this.set('pastLimit', 'users');
      }
      return true
    } else {
      return false
    }
  }),

  logout() {
    this.get('session').invalidate();
  }
});
