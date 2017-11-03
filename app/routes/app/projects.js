import Ember from 'ember';
import Errors from '../../constants/errors';
const { inject: { service } } = Ember;

export default Ember.Route.extend({

  didTransitionViaBackOrForward: function(transition) {
    return transition && transition.sequence > 1 && transition.hasOwnProperty('urlMethod');
  },

  model() {

    return this.get('store').findAll('project')
  },

  segment: Ember.inject.service(),

  actions: {

    createProject(name, result) {
      const newProject = this.get('store').createRecord('project',{
        'name':name
      });
        newProject.save()
        .then(() => {
          this.get('segment').trackEvent('Added a new project', { projectName: name, projectID: newProject.id });
          this.transitionTo('app.project', newProject.get('id'));
          result.resolve();
        }).catch((response)=> {
          result.reject(Errors.mapResponseErrors(response));
          newProject.rollbackAttributes();
        result.reject();
      })

    },

    goToProject(id) {
      this.transitionTo('app.project', id);
    }
  }
});
