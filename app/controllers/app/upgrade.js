import Ember from 'ember';

export default Ember.Controller.extend({

  stripe: Ember.inject.service(),
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
      console.log(card);

      return stripe.card.createToken(card).then(function(response) {
        // you get access to your newly created token here
        console.log(response);
      });
    }
  }
});
