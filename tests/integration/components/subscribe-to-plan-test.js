import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('subscribe-to-plan', 'Integration | Component | subscribe to plan', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{subscribe-to-plan}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#subscribe-to-plan}}
      template block text
    {{/subscribe-to-plan}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
