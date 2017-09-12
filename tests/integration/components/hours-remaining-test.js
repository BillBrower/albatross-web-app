import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('hours-remaining', 'Integration | Component | hours remaining', {
  integration: true
});

test('it renders nothing when icon and text is not present', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{hours-remaining}}`);

  assert.equal(this.$().text().trim(), '');

});

test('it renders correct text when the hours difference is greater than 10% of the estimate', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{hours-remaining text=true estimated=10 actual=4}}`);

  assert.equal(this.$().text().trim(), '6 under');
  assert.ok(this.$('.green').length)

});

test('it renders correct text when the hours difference is less than 10% of the estimate but greater than 0', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{hours-remaining text=true estimated=11 actual=10}}`);

  assert.equal(this.$().text().trim(), '1 under');
  assert.ok(this.$('.yellow').length)

});

test('it renders icon when true', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{hours-remaining text=true icon=true estimated=11 actual=10}}`);

  assert.equal(this.$().text().trim(), '1 under');
  assert.ok(this.$('.yellow').length);
  assert.ok(this.$('.icon').length);

});

test('it renders correct text when the hours difference is less than 0', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{hours-remaining text=true estimated=10 actual=15}}`);

  assert.equal(this.$().text().trim(), '5 over');
  assert.ok(this.$('.red').length)

});
