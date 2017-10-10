import Ember from 'ember';
import Errors from '../../constants/errors';
import ENV from 'albatross-web-app/config/environment';
const { inject: { service } } = Ember;

export default Ember.Controller.extend({

  creditCard: [],
  card: Ember.computed('creditCard', 'expDate', function() {
    return {
      name: this.get('creditCard.name'),
      number: this.get('creditCard.number'),
      exp_month: this.get('expDate').substring(0,2),
      exp_year: this.get('expDate').substring(5),
      cvc: this.get('creditCard.cvc')
    }
  }),
  currentUser: Ember.inject.service('current-user'),
  notifications: Ember.inject.service('notification-messages'),
  segment: Ember.inject.service(),
  session: Ember.inject.service(),
  setupNotifications: function () {
    this.get('notifications').setDefaultClearDuration(1200);
  }.observes('notifications').on('init'),
  stripe: Ember.inject.service(),
  toggleToken: null,
  isCancellingPlan: false,
  isChangingCard: false,
  isChangingPlan: false,
  selectedPlan: 'freelancer-beta-annual',

  currentPlan: Ember.computed('currentUser', function() {
    var plan = this.get('currentUser.teamPlan');
  }),

  currentCard: Ember.computed('currentUser', function() {
    new Ember.RSVP.Promise((resolve, reject) => {
      this.get('session').authorize('authorizer:django-token-authorizer', (headerName, headerValue) => {
        const headers = {};
        headers[headerName] = headerValue;
        headers['Accept'] = 'application/json';
        Ember.$.ajax({
          url: ENV.host + '/api/v1/payments/details',
          type: 'GET',
          headers: headers,
          contentType: 'application/json',
          dataType: 'json',
        }).then((response) => {
          return response;
          resolve();
        }).catch(() => {
          reject();
        })
      });
    });
  }),

  init() {
    var plan = this.get('currentUser.teamPlan');
    var amount = this.get('currentUser.teamPlanAmount');
    this.set('plan', plan);
    this.set('selectedPlan', plan);
    this.set('planAmount', '$' + amount);

    if (plan) {
      if (plan.includes('freelancer')) {
        this.set('planLabel', 'Freelancer');
        this.set('planDescription', 'Unlimited projects, up to 5 users');
      } else if (plan.includes('agency')) {
        this.set('planLabel', 'Agency');
        this.set('planDescription', 'Unlimited projects, unlimited users, unlimited possibilities');
      }

      if (plan.includes('monthly')) {
        this.set('planBillingCycle', 'monthly');
      } else if (plan.includes('annual')) {
        this.set('planBillingCycle', 'annually');
      }

      new Ember.RSVP.Promise((resolve, reject) => {
        this.get('session').authorize('authorizer:django-token-authorizer', (headerName, headerValue) => {
          const headers = {};
          headers[headerName] = headerValue;
          headers['Accept'] = 'application/json';
          Ember.$.ajax({
            url: ENV.host + '/api/v1/payments/details',
            type: 'GET',
            headers: headers,
            contentType: 'application/json',
            dataType: 'json',
          }).then((response) => {
            this.set('currentCard', response);
            resolve();
          }).catch(() => {
            reject();
          })
        });
      });
    }

  },

  actions: {
    saveAccountButtonPressed() {
      this.set('showError', true);
      if ((!this.get('model.validations.isValid') )) {
        return Ember.RSVP.reject()
      } else {
        let json = this.get('model').serialize();
        json.data.id = this.get('model').get('id');
        delete json.data.attributes.password;
        const result = Ember.RSVP.defer();
        this.get('session')
          .authorize('authorizer:django-token-authorizer', (headerName, headerValue) => {
            const headers = {'Accept': 'application/vnd.api+json'};
            headers[headerName] = headerValue;
            Ember.$.ajax({
              url: `${ENV.host}/api/v1/users/`,
              type: 'PATCH',
              data: JSON.stringify(json),
              headers: headers,
              contentType: 'application/vnd.api+json',
              dataType: 'json',
            }).then(() => {
              this.get('model.profile').then((profile) => {
                if (profile.get('hasDirtyAttributes')) {
                  let profileJson = profile.serialize();
                  profileJson.data.id = profile.get('id');
                  Ember.$.ajax({
                    url: `${ENV.host}/api/v1/users/${this.get('model.id')}/profile/`,
                    type: 'PATCH',
                    data: JSON.stringify(profileJson),
                    headers: headers,
                    contentType: 'application/vnd.api+json',
                    dataType: 'json',
                  }).then(() => {
                    this.set('accountErrors', null);
                    this.get('notifications').success("Account information saved successfully!", {
                      cssClasses: 'notification',
                      autoClear: true,
                    });
                    result.resolve();
                  }).catch((response) => {
                    this.set('accountErrors', Errors.mapResponseErrors(response));
                    result.reject();
                  })
                } else {
                  this.set('accountErrors', null);
                  this.get('notifications').success("Account information saved successfully!", {
                    cssClasses: 'notification',
                    autoClear: true,
                  });
                  result.resolve();
                }

                this.get('segment').trackEvent('Updated settings');
              })
            }).catch((response) => {
              this.set('accountErrors', Errors.mapResponseErrors(response));
              result.reject();
            });
          });

        return result.promise;
      }
    },

    changePasswordButtonPressed() {
      let data = {
        new_password1: this.get('newPassword'),
        new_password2: this.get('newPassword'),
        old_password: this.get('currentPassword')
      };
      const result = Ember.RSVP.defer();
      this.get('session')
        .authorize('authorizer:django-token-authorizer', (headerName, headerValue) => {
          const headers = {'Accept': 'application/json'};
          headers[headerName] = headerValue;
          Ember.$.ajax({
            url: `${ENV.host}/api/v1/password/change/`,
            type: 'POST',
            data: JSON.stringify(data),
            headers: headers,
            contentType: 'application/json',
            dataType: 'json',
          }).then(() => {
            this.set('passwordErrors', null);
            this.get('notifications').success("Password changed successfully!", {
              cssClasses: 'notification',
              autoClear: true,
            });
            result.resolve();
            this.get('segment').trackEvent('Reset password in settings');
          }).catch((response) => {
            const detail = Errors.mapResponseErrors(response);
            const errors = detail[0] === 'Invalid password' ? ['The current password you entered is not correct. Please try again'] : detail
            this.set('passwordErrors', errors);
            result.reject();
          });
        });

      return result.promise;
    },

    toggleIsCancellingPlan() {
      this.toggleProperty('isCancellingPlan');
    },
    toggleIsChangingCard() {
      this.toggleProperty('isChangingCard');
    },
    toggleIsChangingPlan() {
      this.toggleProperty('isChangingPlan');
    },
    choosePlan(plan) {
      this.set('selectedPlan', plan);
    },
    updatePlan() {
      var plan = this.get('selectedPlan');
      var _this = this;

      this.get('session').authorize('authorizer:django-token-authorizer', (headerName, headerValue) => {
        const headers = {};
        headers[headerName] = headerValue;
        headers['Accept'] = 'application/json';
        const data = {
          stripe_plan: plan
        };
        Ember.$.ajax({
          url: ENV.host + '/api/v1/payments/subscription/',
          type: 'POST',
          data: JSON.stringify(data),
          headers: headers,
          contentType: 'application/json',
          dataType: 'json',
        }).then((response) => {
          window.location.reload(true);
        }).catch(() => {
        })
      });
    },
    updateCard() {
      var stripe = this.get('stripe');
      var card = this.get('card');
      var _this = this;
      this.set('cardErrors', null);

      return stripe.card.createToken(card).then(function(response) {
        // you get access to your newly created token here

        _this.get('session').authorize('authorizer:django-token-authorizer', (headerName, headerValue) => {
          const headers = {};
          headers[headerName] = headerValue;
          headers['Accept'] = 'application/json';
          const data = {
            token: response.id
          };
          Ember.$.ajax({
            url: ENV.host + '/api/v1/payments/change-card-token/',
            type: 'POST',
            data: JSON.stringify(data),
            headers: headers,
            contentType: 'application/json',
            dataType: 'json',
          }).then((response) => {
            _this.get('notifications').success("Account information saved successfully!", {
              cssClasses: 'notification',
              autoClear: true,
            });
            _this.set('isChangingCard', false);
          }).catch((response) => {
            console.log(response);
            reject();
          })
        });
      }).catch((response) => {
        this.set('cardErrors', [response.error.message]);
      });
    },
    cancelPlan() {
      var _this = this;

      this.get('session').authorize('authorizer:django-token-authorizer', (headerName, headerValue) => {
        const headers = {};
        headers[headerName] = headerValue;
        headers['Accept'] = 'application/json';
        Ember.$.ajax({
          url: ENV.host + '/api/v1/payments/cancel/',
          type: 'POST',
          headers: headers,
          contentType: 'application/json',
          dataType: 'json',
        }).then((response) => {
          window.location.reload(true);
        }).catch(() => {
        })
      });
    }
  }
});
