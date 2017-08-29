import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.get('store').findAll('project')
  },

  actions: {
    createProject() {
      //TODO: Implement
      this.transitionTo('app.project', '1');
    },

    goToProject(id) {
      this.transitionTo('app.project', id);
    }
  }
});
