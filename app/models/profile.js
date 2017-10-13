import DS from 'ember-data';
const {attr, Model, belongsTo} = DS;


export default Model.extend({
  harvestAccessToken: attr('string'),
  togglApiKey: attr('string'),

  user: belongsTo('user'),
});
