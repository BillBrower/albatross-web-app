import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:reset-password', 'Unit | Controller | reset password', {
  // Specify the other units that are required for this test.
  needs: ['validator:length', 'validator:format', 'validator:confirmation', 'validator:presence']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
