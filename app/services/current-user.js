import Ember from 'ember';

const { inject: { service }, isEmpty, RSVP } = Ember;

export default Ember.Service.extend({
  session: service(),
  store: service(),

  load() {
    let userId = this.get('session.data.authenticated.user_id');
    if (!isEmpty(userId)) {
      return this.get('store').findRecord(this.get('session.data.authenticated.user_type'), userId).then((user) => {
        this.set('user', user);
      });
    } else {
      return RSVP.resolve();
    }
  },

  logout() {
    this.get('session').invalidate();
  }
});
