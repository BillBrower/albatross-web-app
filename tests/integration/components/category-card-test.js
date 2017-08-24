import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('category-card', 'Integration | Component | category card', {
  integration: true
});

test('it renders', function(assert) {

  assert.expect(0);
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  /*this.set('saveDescription', function(){});
  this.set('saveActual', function(){});
  this.set('saveEstimated', function(){});
  this.render(hbs`{{category-card onSaveDescription=(action saveDescription) onSaveActual=(action saveActual)
  onSaveEstimated=(action saveEstimated)}}`);

  assert.equal(this.$().text().trim(), '');*/

  /*// Template block usage:
  this.render(hbs`
    {{#category-card}}
      template block text
    {{/category-card}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');*/
});
