import DS from 'ember-data';
const {attr, Model, belongsTo} = DS;


export default Model.extend({
  role: attr('string'),
  state: attr('string'),

  user: belongsTo('user'),
  invitation: belongsTo('invitation'),
  team: belongsTo('team')
});
