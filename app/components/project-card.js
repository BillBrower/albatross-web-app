import Ember from 'ember';
import Status from "../constants/status";

export default Ember.Component.extend({
  tagName:'',

  setupColor: function() {
    const estimated = this.get('model.estimated');
    const actual = this.get('model.actual');
    const statusColor = Status.statusColor(estimated, actual);
    this.set('color', statusColor);
  }.observes('model.estimated','model.actual').on('init'),

  actions: {
    cardClicked() {
      this.get('onCardClicked')(this.get('model.id'));
    }
  }
});
