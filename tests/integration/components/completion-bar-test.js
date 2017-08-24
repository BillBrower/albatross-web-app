import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('completion-bar', 'Integration | Component | completion bar', {
  integration: true
});

test('it renders a percentage', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{completion-bar estimated=37 actual=33}}`);

  assert.equal(this.$().text().trim(), '89%');

});
