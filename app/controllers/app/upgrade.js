import Ember from 'ember';
import ENV from 'albatross-web-app/config/environment';

const { inject: { service }} = Ember;

export default Ember.Controller.extend({

  currentUser: Ember.inject.service('current-user'),
  stripe: Ember.inject.service(),
  session: Ember.inject.service('session'),
  store: service(),
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

  selectedPlan: 'freelancer-beta-annual',
  selectedPlanName: Ember.computed('selectedPlan', function() {
    var plan = this.get('selectedPlan');

    if (plan === 'agency-beta-monthly' || plan === 'agency-beta-annual') {
      return 'Agency Plan';
    } else if (plan === 'freelancer-beta-monthly' || plan === 'freelancer-beta-annual') {
      return 'Freelancer Plan';
    } else {
      return null;
    }
  }),
  selectedPlanPrice: Ember.computed('selectedPlan', function() {
    var plan = this.get('selectedPlan');

    if (plan === 'agency-beta-annual') {
      return '$250';
    } else if (plan === 'agency-beta-monthly') {
      return '$25';
    } else if (plan === 'freelancer-beta-annual') {
      return '$100';
    } else if (plan === 'freelancer-beta-monthly') {
      return '$10';
    } else {
      return null;
    }
  }),
  selectedPlanCycle: Ember.computed('selectedPlan', function() {
    var plan = this.get('selectedPlan');

    if (plan === 'agency-beta-monthly' || plan === 'freelancer-beta-monthly') {
      return 'monthly';
    } else if (plan === 'agency-beta-annual' || plan === 'freelancer-beta-annual') {
      return 'annually';
    } else {
      return null;
    }
  }),

  actions: {

    choosePlan(plan) {
      this.set('selectedPlan', plan);
    },

    upgrade() {
      var stripe = this.get('stripe');
      var card = this.get('card');
      var plan = this.get('selectedPlan');
      var _this = this;

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
            _this.get('session').authorize('authorizer:django-token-authorizer', (headerName, headerValue) => {
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
                console.log(response);
                resolve();
              }).catch(() => {
                reject();
              })
            });
          }).catch(() => {
            reject();
          })
        });
      }).catch((response) => {
        this.set('cardErrors', [response.error.message]);
      });
    }
  }
});
