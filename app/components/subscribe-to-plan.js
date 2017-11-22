import Ember from 'ember';
import { plans } from '../constants/plans'
const { inject: { service }} = Ember;
import Errors from '../constants/errors'
import ENV from 'albatross-web-app/config/environment';

export default Ember.Component.extend({

  currentUser: service('current-user'),
  stripe: service(),
  segment: service(),
  session: service(),
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
  plans: plans,

  selectedPlan: plans.freelancer.annually,
  selectedPlanName: Ember.computed('selectedPlan', function() {
    var plan = this.get('selectedPlan');
    if (plan.type === 'agency') {
      return 'Agency Plan';
    } else if (plan.type === 'freelancer') {
      return 'Freelancer Plan';
    } else {
      return null;
    }
  }),
  selectedPlanPrice: Ember.computed('selectedPlan', function() {
    var plan = this.get('selectedPlan');
    return plan.price
  }),
  selectedPlanCycle: Ember.computed('selectedPlan', function() {
    var plan = this.get('selectedPlan');
    return plan.frequency
  }),

  actions: {

    choosePlan(plan) {
      this.set('selectedPlan', plan);
    },

    upgrade() {
      var stripe = this.get('stripe');
      var cardd = this.get('card');
      var plan = this.get('selectedPlan').name;

      var card = {
        name: this.get('creditCard.name'),
        number: this.get('creditCard.number'),
        exp_month: this.get('expDate').substring(0,2),
        exp_year: this.get('expDate').substring(5),
        cvc: this.get('creditCard.cvc')
      };

      this.get('segment').trackEvent('Upgraded plan', {
        plan: plan
      });

      this.set('cardErrors', []);

      const _this = this;
      const result = Ember.RSVP.defer();
      stripe.card.createToken(card).then(function(response) {
        // you get access to your newly created token here
       return _this.get('session').authorize('authorizer:django-token-authorizer', (headerName, headerValue) => {
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
                this.get('segment').trackEvent('Upgraded plan', {
                  plan: plan
                });
                var path = window.location.href.split('/')[0];
                window.location.href = path + '/app/projects';
                result.resolve();
              }).catch(() => {
                var path = window.location.href.split('/')[0];
                window.location.href = path + '/app/projects';
                result.reject();
              })
            });
          }).catch(() => {
            var path = window.location.href.split('/')[0];
            window.location.href = path + '/app/projects';
            result.reject();
          })
        });
      }).catch((response) => {
        this.set('cardErrors', Errors.mapResponseErrors(response));
        result.reject()
      });
      return result.promise();
    }
  }
});
