import Ember from 'ember';

export default Ember.Route.extend({

  model(params) {
    //TODO: Wait until backend is ready
    /*
    this.set('id', params.project_id);
    return this.get('store').findRecord('project', params.project_id, { reload: true });
    */
  },
});
