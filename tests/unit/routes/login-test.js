import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('route:login', 'Unit | Route | login', {
  // Specify the other units that are required for this test.
   needs: ['service:session']
});

test('it sets an error on the controller when authentication fails', function(assert) {
  assert.expect(2);
  let route = this.subject();
  let controller = Ember.Object.create();

  let session = Ember.Object.create({
    authenticate: function() {
      return Ember.RSVP.reject();
    }
  });

  route.set('controller', controller);
  route.set('session', session);
  Ember.run(function(){
    route.send('login', 'a@b.com', 'aaa', (() => {
      assert.ok('failed');
    }));
  });

  assert.equal(route.get('controller.errors')[0], ["Your username and password combination is not correct. Please try again."][0]);
});
