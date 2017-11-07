import Ember from 'ember';

export default Ember.Component.extend({

  isSelected: Ember.computed('plan', 'selectedPlan', function() {
    const plan = this.get('plan');
    const selectedPlan = this.get('selectedPlan');

    return plan !== "undefined" && plan === selectedPlan;
  }),

  actions: {
    choosePlan() {
      const plan = this.get('plan');
      this.get('choosePlan')(plan);
    }
  }
});
