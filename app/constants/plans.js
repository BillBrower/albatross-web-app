const plans = {
  "freelancer": {
    "monthly": {
      "frequency": "monthly",
      "name": "freelancer-monthly",
      "maxProjects": "unlimited",
      "maxUsers": 5,
      "price": "$25",
      "type": "freelancer"
    },
    "annually": {
      "frequency": "annually",
      "name": "freelancer-annual",
      "maxProjects": "unlimited",
      "maxUsers": 5,
      "price": "$250",
      "type": "freelancer"
    }
  },
  "agency": {
    "monthly": {
      "frequency": "monthly",
      "name": "agency-monthly",
      "maxProjects": "unlimited",
      "maxUsers": "unlimited",
      "price": "$50",
      "type": "agency"
    },
    "annually": {
      "frequency": "annually",
      "name": "agency-annual",
      "maxProjects": "unlimited",
      "maxUsers": "unlimited",
      "price": "$500",
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
