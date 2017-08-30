import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.get('store').findAll('project')
  },

  actions: {

    createProject(name, result) {
      const newProject = this.get('store').createRecord('project',{
        'name':name
      });
        newProject.save()
        .then(() => {
          this.transitionTo('app.project', newProject.get('id'));
        }).catch((response)=> {
          newProject.rollbackAttributes();
        result.reject();
      })

    },

    goToProject(id) {
      this.transitionTo('app.project', id);
    }
  }
});
