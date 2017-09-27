import Ember from 'ember';
import Permissions from '../../constants/permissions';

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

  onTrial: false,
  planExpired: false,
  paymentPlan: 0,

  addProjects: Ember.computed('onTrial', 'needToUpgrade', 'paymentPlan', function() {
    var onTrial = this.get('onTrial');
    var currentProjects = this.get('sortedProjects').length;
    var paymentPlan = this.get('paymentPlan')

    if (onTrial || currentProjects < 1) {
      return true;
    } else if (paymentPlan > 0) {
      return true;
    } else {
      return false;
    }
  }),

  canAddProjects: Ember.computed('sortedProjects', 'currentUser', function() {
    var itemsToCheck = this.get('sortedProjects').length;
    var user = this.get('currentUser.user');
    return Permissions.canAdd(user, itemsToCheck, 'projects');
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
