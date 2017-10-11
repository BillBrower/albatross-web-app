import Ember from 'ember';
import Params from '../../constants/params';

export default Ember.Route.extend({

  model(params) {
    this.set('id', params.project_id);
    return this.get('store').findRecord('project', params.project_id, { reload: true });
  },

  setupController(transition) {
    this._super(...arguments);
    //transition.send('getHarvestTokens', Params.getParameterByName('code', window.location.href));
  }
});
