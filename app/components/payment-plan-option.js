import Ember from 'ember';

export default Ember.Component.extend({

  isSelected: Ember.computed('plan', 'selectedPlan', function() {
    var plan = this.get('plan');
    var selectedPlan = this.get('selectedPlan');

    if (plan !== "undefined" && plan === selectedPlan) {
      return true;
    } else {
      return false;
    }
  }),

  actions: {
    choosePlan() {
      var plan = this.get('plan');
      this.get('choosePlan')(plan);
    }
  }
});
