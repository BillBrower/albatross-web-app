export default {
  statusColor(estimated, actual) {
    const difference = estimated - actual;
    if (difference > estimated * .1) {
      return 'green';
    } else if (difference >= 0) {
      return 'yellow'
    } else {
      return 'red'
    }
  }
}
