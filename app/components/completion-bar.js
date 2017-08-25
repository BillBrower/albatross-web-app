import Ember from 'ember';
import Status from '../constants/status';

export default Ember.Component.extend({

  percentageObserver: function() {
    const estimated = this.get('estimated');
    const actual = this.get('actual');
    if (actual > estimated) {
      this.set('percentage', '100');
    } else {
      this.set('percentage',`${Math.floor((actual / estimated) * 100)}`);
    }
    this.set('color', Status.statusColor(estimated, actual));

  }.observes('estimated', 'actual').on('init')

});
