import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('hours-remaining', 'Integration | Component | hours remaining', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{hours-remaining}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#hours-remaining}}
      template block text
    {{/hours-remaining}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
