import Ember from 'ember';

export default Ember.Component.extend({

  percentageObserver: function() {
    const estimated = this.get('estimated');
    const actual = this.get('actual');
    if (actual > estimated) {
      this.set('percentageWidth', '100%');
    } else {
      this.set('percentageWidth',`${Math.floor((actual / estimated) * 100)}%`);
    }
  }.on('init')

});
