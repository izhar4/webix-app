var models                  = require('../models/index');
var _                       = require('underscore');


/**
Function to get claims data of all users
*/
exports.getClaimsData = function(req, res){
  models.table_ClaimsData.findAll({
    include: [
      { model: models.table_User,attributes:['subscriber_id', 'first_name', 'last_name' ]},
    ],
    raw:true
  }).then(function(data){
    if(data && data.length > 0){
      let respObj = [];
      _.each(data, function(record){
        if(record['table_User.subscriber_id']){
          record['subscriber_id'] = record['table_User.subscriber_id'];
          delete record['table_User.subscriber_id'];
        }
        if(record['table_User.last_name']){
          record['user_lastname'] = record['table_User.last_name'];
          delete record['table_User.last_name'];
        }
        if(record['table_User.first_name']){
          record['user_firstname'] = record['table_User.first_name'];
          delete record['table_User.first_name'];
        }
        respObj.push(record)
      });
        res.status(200).json(respObj)   
    }else{
      res.status(200).json([]);
    }
  }).catch(function(err){
    res.status(400).json(err);
  });
}