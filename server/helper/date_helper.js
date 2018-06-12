var config    = require(__dirname + '/../config.json');
var time_config = {
  "time_US": 0,
  "time_IN": 480
}
exports.date_convert_to_IST = function(date){
  var new_date = new Date(date);
  new_date.setMinutes( new_date.getMinutes() + time_config[config.development.time_zone] );
  return new_date.toISOString();;
}
