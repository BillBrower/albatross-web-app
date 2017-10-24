import Errors from '../constants/errors'
import Ember from 'ember';
import ENV from 'albatross-web-app/config/environment';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
const { inject: { service } } = Ember;

export default Ember.Route.extend(UnauthenticatedRouteMixin,{

  routeIfAlreadyAuthenticated: ENV.routeAfterAuthentication,
  segment: Ember.inject.service(),

  beforeModel() {
    this._super(...arguments);
    window.scrollTo(0,0);
  },

  actions: {
    signup(user, teamName, inviteCode, wantsEmail, result) {
      const json = user.serialize();
      if (inviteCode) {
        json.data.attributes.code = inviteCode;
      }
      if (wantsEmail) {
        json.data.attributes.subscribe_to_newsletter = true;
      }
      Ember.$.ajax({
        url: ENV.host + '/api/v1/registration/',
        type: 'POST',
        data: JSON.stringify(json),
        headers: {
          'Accept': 'application/vnd.api+json'
        },
        contentType: 'application/vnd.api+json',
        dataType: 'json',
      }).then((res) => {
          this.get('segment').identifyUser(res.data.id, res.data);
          this.get('session')
            .authenticate('authenticator:django-rest-authenticator', user.get('email'), user.get('password'))
            .then(() => {
            if (inviteCode) {
              this.get('segment').trackEvent('Signed up from invite', { email: user.get('email'), invited: true, inviteCode: inviteCode });
              this.transitionTo('app.projects');
            } else {
              const team = this.get('store').createRecord('team', {
                name: teamName
              });
              team.save()
                .then(() => {
                  this.get('segment').trackEvent('Signed up team', { email: user.get('email'), team: teamName, invited: false});
                  this.transitionTo('app.projects');
                }).catch((response) => {
                this.get('session').invalidate();
                this.controller.set('errors', Errors.mapResponseErrors(response));
                result.reject();
              });
            }
            })
            .catch((response) => {
              this.controller.set('errors', Errors.mapResponseErrors(response));
              result.reject();
            });
      }).catch((response) => {
        this.controller.set('errors', Errors.mapResponseErrors(response));
        result.reject();
      });
    }
  }
});
