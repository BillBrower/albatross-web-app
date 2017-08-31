import Ember from 'ember';

export default Ember.Component.extend({
  tagName:'',

  actions: {
    cardClicked() {
      //TODO: Replace with id
      this.get('onCardClicked')('1');
    }
  }
});
