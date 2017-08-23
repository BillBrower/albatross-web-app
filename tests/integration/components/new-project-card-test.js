import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('new-project-card', 'Integration | Component | new project card', {
  integration: true
});

test('it renders + New Project when not adding new project', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{new-project-card}}`);

  assert.equal(this.$().text().trim(), '+ New Project');
  assert.equal(this.$('#newProjectName').length, 0);
});

test('it renders a text field when editing', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{new-project-card isAddingNewProject=true}}`);

  assert.ok(this.$('input').length);
});
