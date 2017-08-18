import Ember from 'ember';

export default Ember.Component.extend({

  didRender(){
    if (this.get('focusOnRender')) {
      this.$('input').focus();
    }
  },
});
