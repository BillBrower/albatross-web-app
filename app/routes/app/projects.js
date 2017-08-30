import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.get('store').findAll('project')
  },

  actions: {

    createProject(name, result) {
      this.get('store').createRecord('project',{
        'name':name
      }).save()
        .then(() => {
          this.transitionTo('app.project', '1');
        }).catch((response)=> {
        result.reject();
        console.log(response);
      })

    },

    goToProject(id) {
      this.transitionTo('app.project', id);
    }
  }
});
