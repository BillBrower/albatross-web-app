import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:app/project', 'Unit | Controller | app/project', {
  // Specify the other units that are required for this test.
   needs: ['service:current-user', 'service:session', 'service:notification-messages-service'],

  beforeEach() {
    const notifications = this.container.lookupFactory('service:notification-messages-service');
    this.register('service:notification-messages', notifications);
  }
});

test('it only sets hasCategories to true when a project has more than one category', function(assert) {
  let controller = this.subject();
  let model = Ember.Object.create({
    categories: {
      content: []
    }
    });
    controller.set('model', model);

    assert.notOk(controller.get('hasCategories'));

    controller.set('model.categories', {content: ['A Category']});

    assert.ok(controller.get('hasCategories'));

});

test('It reloads the model and item after saving an item', function(assert) {
  assert.expect(4);
  let controller = this.subject();
  let item = Ember.Object.create({
    category: {
      id: 2
    },
    save: function() {
      assert.ok('Save called');
      return Ember.RSVP.resolve();
    },
    validations: {
      isValid: true
    }
  });

  let model = {
    reload: function() {
      assert.ok('Reload called on model');
    }
  };

  let store = {
    findRecord: function(model, id) {
      assert.equal(model, 'category');
      assert.equal(id, 2);
    }
  };

  controller.set('model', model);
  controller.set('store', store);
  controller.saveItem(item);
});
