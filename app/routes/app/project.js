import Ember from 'ember';

export default Ember.Route.extend({

  model(params) {
    this.set('id', params.project_id);
    return this.get('store').findRecord('project', params.project_id, { reload: true });

  },
});
