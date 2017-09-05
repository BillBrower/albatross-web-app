import DS from 'ember-data';
const {attr, Model, belongsTo} = DS;


export default Model.extend({
  email: attr('string'),

  membership: belongsTo('membership'),
});
