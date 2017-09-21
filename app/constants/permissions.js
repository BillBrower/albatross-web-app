import Ember from 'ember';
const { inject: { service } } = Ember;

const onTrial = true;
const paymentPlan = 0;

export default {

  canAdd(currentUser, itemsToCheck, typeOfItems) {

    let maxItemsAllowed = 1;

    if (typeOfItems === 'users' && paymentPlan > 0) {
      if (paymentPlan === 1) {
        maxItemsAllowed = 5;
      } else if (paymentPlan > 1) {
        maxItemsAllowed = 25;
      }
    }

    if (onTrial || itemsToCheck < maxItemsAllowed) {
      return true;
    } else if (typeOfItems === 'projects' && paymentPlan > 0) {
      return true;
    } else {
      return false;
    }
  }
}
