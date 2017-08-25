import Ember from 'ember';
import Status from '../constants/status';

export default Ember.Component.extend({

  hoursObserver: function() {
    const estimated = this.get('estimated');
    const actual = this.get('actual');
    const difference = estimated - actual;
    const statusColor = Status.statusColor(estimated, actual);
    this.set('color', statusColor);
    if (statusColor === 'green') {
      this.set('formattedText', `${difference} under`);
    } else if (statusColor === 'yellow') {
      this.set('formattedText',`right on`);
    } else if (statusColor === 'red') {
      this.set('formattedText', `${Math.abs(difference)} over`);
    }
  }.observes('estimated','actual').on('init')
});
