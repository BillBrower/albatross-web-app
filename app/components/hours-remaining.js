import Ember from 'ember';
import Status from '../constants/status';

export default Ember.Component.extend({

  hoursObserver: function() {
    const estimated = this.get('estimated');
    const actual = this.get('actual');
    //Because javascript doesn't subtract numbers with decimals well
    const difference = parseFloat(Number(estimated - actual).toFixed(2));
    const statusColor = Status.statusColor(estimated, actual);
    this.set('color', statusColor);
    if (difference > 0) {
      this.set('formattedText', `${difference} under`);
    } else if (difference === 0) {
      this.set('formattedText',`right on`);
    } else if (difference < 0) {
      this.set('formattedText', `${Math.abs(difference)} over`);
    }
  }.observes('estimated','actual').on('init')
});
