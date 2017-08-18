export default {
  mapResponseErrors(response) {
    let errors = [];
    if (response.isAdapterError) {
      errors = response.errors;
    } else {
      errors = response.responseJSON.errors;
    }
    return errors.map(function (error) {
      return error.detail;
    });
  },
  presenceError: '{description} is a required field.',
};
