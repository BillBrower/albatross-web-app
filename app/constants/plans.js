const plans = {
  "freelancer": {
    "monthly": {
      "frequency": "monthly",
      "name": "freelancer-beta-monthly",
      "maxProjects": "unlimited",
      "maxUsers": 5,
      "price": "$10",
      "type": "freelancer"
    },
    "annually": {
      "frequency": "annually",
      "name": "freelancer-beta-annual",
      "maxProjects": "unlimited",
      "maxUsers": 5,
      "price": "$100",
      "type": "freelancer"
    }
  },
  "agency": {
    "monthly": {
      "frequency": "monthly",
      "name": "agency-beta-monthly",
      "maxProjects": "unlimited",
      "maxUsers": "unlimited",
      "price": "$25",
      "type": "agency"
    },
    "annually": {
      "frequency": "annually",
      "name": "agency-beta-annual",
      "maxProjects": "unlimited",
      "maxUsers": "unlimited",
      "price": "$250",
      "type": "agency"
    }
  }
};

function planFromName(name) {
  if (name === plans.freelancer.monthly.name) {
    return plans.freelancer.monthly
  } else if (name === plans.freelancer.annually.name) {
    return plans.freelancer.annually
  } else if (name === plans.agency.monthly.name) {
    return plans.agency.monthly;
  } else if (name === plans.agency.annually.name) {
    return plans.agency.annually
  }

  return null;
}

export {
  plans, planFromName
};
