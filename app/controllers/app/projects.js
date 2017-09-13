import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Controller.extend({

  currentUser: service('current-user'),
  sortedProjects: Ember.computed.sort('model', 'sortDefinition'),
  sortDefinition: ['name'],
  timeOfDay: Ember.computed(function() {
    const now = new Date();
    const time = moment(now).hour();

    if (time > 17) {
      return "evening";
    } else if (time > 11) {
      return "afternoon"
    } else if (time > 3) {
      return "morning"
    } else {
      return "evening"
    }
  }),

  init() {
    this._super(...arguments);
    console.log(this.get('timeOfDay'));
  },

  actions: {
      createNewProject(name, result) {
        this.send('createProject', name, result);
      }
  }
});
