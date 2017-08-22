import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:app/projects', 'Unit | Controller | app/projects', {
  // Specify the other units that are required for this test.
   needs: ['validator:presence', 'service:current-user']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});

test('it toggles isAddingNewProject correctly', function(assert) {
  let controller = this.subject();
  controller.set('isAddingNewProject', false);
  controller.send('toggleIsAddingNewProject');
  assert.ok(controller.get('isAddingNewProject'));

  controller.send('toggleIsAddingNewProject');
  assert.notOk(controller.get('isAddingNewProject'));
});
