import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';
import ValidationErrors from '../constants/errors';

const Validations = buildValidations({
  togglApiToken: validator('presence', {
    presence: true,
    message: ValidationErrors.presenceError,
    description: 'Toggl API Token'
  }),

});
export default Ember.Component.extend(Validations,{

  actions: {
    close() {
      this.get('close')();
    },

    choseToggl() {
      this.set('isImportingToggl', true);
    },
    choseHarvest() {
      var currentLocation = window.location;
      window.location.replace('https://id.getharvest.com/oauth2/authorize?client_id=7v4QX7tivd6wsBFK2oHKXEbB&response_type=code&redirect_uri=https://app.getalbatross.com/app/project/' + this.get('model.id'));
    },

    importButtonPressed() {
      this.set('showError', true);
      if (!this.get('validations.isValid')) {
        return Ember.RSVP.reject();
      }
      const result = Ember.RSVP.defer();
      const token = this.get('togglApiToken');
      this.get('onImport')(token, result);
      return result.promise.then(() => {
        this.send('close');
      })
    }
  }
});
