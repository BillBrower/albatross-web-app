import Ember from 'ember';
import ENV from 'albatross-web-app/config/environment';
import DS from 'ember-data';
import { plans, planFromName } from '../constants/plans'

const {inject: {service}} = Ember;

export default Ember.Service.extend({
  session: service(),
  store: service(),

  load() {
    if (this.get('session.isAuthenticated') && !this.isLoadingUser) {
      this.isLoadingUser = true;
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
              user.get('membership').then((membership) => {
                this.set('user', user);
                if (membership === null) {
                  this.set('isLoadingUser', false);
                  resolve();
                  return;
                }
                const teamId = membership.get('team.id');
                const role = membership.get('role');
                this.get('store').findRecord('team', teamId).then((response) => {
                  this.set('onTrial', response.get('onTrial'));
                  this.set('teamName', response.get('name'));
                  this.set('isLoadingUser', false);
                  resolve();
                }).catch(() => {
                  this.set('isLoadingUser', false);
                  reject();
                });

                if (role === 'owner') {
                  this.set('isOwner', true);
                } else {
                  this.set('isOwner', false);
                }

              }).catch(() => {
                this.isLoadingUser = false;
                reject();
              });
            } else {
              this.isLoadingUser = false;
              reject();
            }
          }).catch(() => {
            this.isLoadingUser = false;
            reject();
          });
        })
      });
    } else {
      this.isLoadingUser = false;
      return Ember.RSVP.resolve();
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
          var plan = planFromName(response.plan);
          this.set('teamPlan', plan);
          this.set('teamPlanAmount', response.amount);


          if (plan !== null) {
            this.set('maxProjects', plan.maxProjects);
            this.set('maxUsers', plan.maxUsers);
          } else {
            if (!this.get('onTrial')) {
              if (this.get('currentUser.user.profile.beta')) {
                this.set('maxProjects', 1);
                this.set('maxUsers', 1);
              } else {
                this.set('maxProjects', -1);
                this.set('maxProjects', -1);
              }
            } else {
              this.set('maxProjects', 'unlimited');
              this.set('maxUsers', 'unlimited');
            }
          }
        }).catch(() => {
        })
      });
    }
  }.observes('onTrial').on('init'),

  needsToUpgrade: Ember.computed('user', 'maxUsers', 'maxProjects', 'onTrial', function () {
    const projectsArray = this.get('store').peekAll('project');
    if (this.get('user')) {
      return DS.PromiseObject.create({
        promise: this.get('user.membership').then((membership) => {
          if (!membership) {
            return false;
          }
          return membership.get('team.users').then((usersArray) => {
            const projects = projectsArray.get('length');
            const users = usersArray.get('length');
            const maxProjects = this.get('maxProjects');
            const maxUsers = this.get('maxUsers');
            const onTrial = this.get('onTrial');

            if (onTrial === undefined) {
              return false;
            }

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
          })
        })
      });
    }
  }),

  logout() {
    this.get('session').invalidate();
  }
});
