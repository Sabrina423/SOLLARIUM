const moment = require('moment');

// Formatação de datas
exports.formatDate = function(date) {
  return moment(date).format("DD/MM/YYYY HH:mm");
};