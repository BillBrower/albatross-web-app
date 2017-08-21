import Ember from 'ember';
import Validations from "../constants/validations";
import {buildValidations} from "ember-cp-validations";

const { RSVP } = Ember;

export default Ember.Controller.extend(buildValidations(Validations.Password),{

  confirmPassword: null,
  password:null,

  actions: {
    saveButtonPressed() {
      this.set('errors', null);

      const result = RSVP.defer();
      const errors = this.get('validations.messages');
      this.set('showError', true);
      if (errors.length > 0) {
        this.set('errors', errors);
        return new Ember.RSVP.Promise(function (resolve, reject) {
          reject();
        });
      } else {
        const password = this.get('password');
        const token = this.get('model.token');
        this.send('resetPassword', token, password, result);

      }

      return result.promise;
    }
  },
});
