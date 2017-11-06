import DS from 'ember-data';
const {attr, Model, belongsTo} = DS;


export default Model.extend({
  harvestAccessToken: attr('string'),
  togglApiKey: attr('string'),
  wantsWeeklyEmails: attr('boolean'),
  user: belongsTo('user'),
});
