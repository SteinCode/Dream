module.exports = {
  formatDateAndTime: function (date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    const hour = `${date.getHours()}`.padStart(2, "0");
    const minute = `${date.getMinutes()}`.padStart(2, "0");
    const datetimeLocalString = `${year}-${month}-${day}T${hour}:${minute}`;
    return datetimeLocalString;
  },
  eq: function (a, b) {
    if (a === b) {
      return true;
    } else {
      return false;
    }
  },
};
