import Ember from 'ember';

export default Ember.Component.extend({

  hoursObserver: function() {
    const estimated = this.get('estimated');
    const actual = this.get('actual');
    const difference = estimated - actual;
    if (difference > estimated * .1) {
      this.set('formattedText', `${difference} under`);
      this.set('formattedIcon', 'green icon')
    } else if (difference >= 0) {
      this.set('formattedText',`right on`);
      this.set('formattedIcon', 'yellow icon');
    } else {
      this.set('formattedText', `${Math.abs(difference)} over`);
      this.set('formattedIcon', 'red icon')
    }
  }.on('init')
});
