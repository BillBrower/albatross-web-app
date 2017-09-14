import Ember from 'ember';
import Status from '../constants/status';

export default Ember.Component.extend({

  tagName: '',
  percentageObserver: function() {
    const estimated = this.get('estimated');
    const actual = this.get('actual');
    if (actual > estimated) {
      this.set('percentage', '100');
    } else {
      this.set('percentage',`${Math.floor((actual / estimated) * 100)}`);
    }
    if (estimated) {
      this.set('color', Status.statusColor(estimated, actual));
    }
    
  }.observes('estimated', 'actual').on('init')

});
