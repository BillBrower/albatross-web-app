import Errors from '../constants/errors'
import Ember from 'ember';

export default Ember.Route.extend({

  actions: {
    signup(user, result) {
      user.save().then(() => {
        this.transitionTo('app.projects');
      }).catch((response) => {
        this.controller.set('errors', Errors.mapResponseErrors(response))
        result.reject();
      })
    }
  }
});
