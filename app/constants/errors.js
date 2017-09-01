export default {
  mapResponseErrors(response) {
    let errors = [];
    if (response.isAdapterError) {
      errors = response.errors;
    } else {
      if (response.responseJSON.errors) {
        errors = response.responseJSON.errors;
      } else {
        for (const key in response.responseJSON) {
          if (response.responseJSON.hasOwnProperty(key)) {
            errors.push(response.responseJSON[key])
          }
        }
        return [].concat.apply([], errors);
      }
    }
    return errors.map(function (error) {
      return error.detail;
    });
  },
  presenceError: '{description} is a required field.',
};
