import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Controller.extend({

  currentUser: service('current-user'),
  sortedProjects: Ember.computed.sort('model', 'sortDefinition'),
  sortDefinition: ['name'],
  notifications: Ember.inject.service('notification-messages'),
  setupNotifications: function () {
    this.get('notifications').setDefaultClearDuration(1000);
  }.observes('notifications').on('init'),
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

  actions: {
      createNewProject(name, result) {
        if (this.get('sortedProjects.length') < 1) {
          this.get('notifications').success("Way to go! You just added your first project. 🏆", {
            cssClasses: 'notification',
            autoClear: true,
            clearDuration: 5000
          });
        }
        this.send('createProject', name, result);
      }
  }
});
