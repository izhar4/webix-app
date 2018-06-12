var models                  = require('../models/index');
var _                       = require('underscore');


exports.getUserCorrespondenceData = function(id, callback){
  models.table_User.findOne({ where: {UserID: id} ,
    include: [
      { model: models.table_Correspondence}
    ],
    order: [
     [models.table_Correspondence , 'createdAt', 'DESC' ]
    ]
  }).then(data => {
    if(data && data.hasOwnProperty('dataValues') && !_.isUndefined(data.dataValues) && data.dataValues.hasOwnProperty('table_Correspondences')){
      let respObj=[];
      _.each(data.dataValues.table_Correspondences, function(record){
         respObj.push(record['dataValues'])
      });
      let user_firstname;
      let user_lastname;
      if(data.dataValues.hasOwnProperty('first_name') && !_.isNull(data.dataValues.first_name)){
         user_firstname = data.dataValues.first_name;
      }
      if(data.dataValues.hasOwnProperty('last_name') && !_.isNull(data.dataValues.last_name)){
         user_lastname = data.dataValues.last_name;
      }
      if(respObj.length > 0){
        _.each(respObj, function(record){
          if(!_.isUndefined(user_firstname)){
            record['user_firstname']=user_firstname;
          }
          if(!_.isUndefined(user_lastname)){
             record['user_lastname']=user_lastname;
          }
          delete record['table_CorrespondenceType']
          if(record.date_sent && !_.isUndefined(record.date_sent) && !_.isNull(record.date_sent)){
           record['date_sent'] = record['date_sent'].toISOString().slice(0,10);
          }
          if(record.updated_at && !_.isUndefined(record.updated_at) && !_.isNull(record.updated_at)){
           record['updated_at'] = record['updated_at'].toISOString().slice(0,10);
          }
        });
        let data_arr = []
         data_arr.push(respObj[0]);
         callback(null, data_arr)
      }else{
        callback(null, respObj)
      }
    }else{
      callback(null);
    }
  }).catch(function(error){
    callback(error)
  });
}


exports.getUserEnrollmentData = function(id, callback){
  models.table_User.findOne({ where: {UserID: id} ,
    include: [
      { model: models.table_Enrollment}
    ],
    order: [
     [models.table_Enrollment , 'createdAt', 'DESC' ]
    ]
  }).then(data => {
    if(data && !_.isUndefined(data)){
      if(data.hasOwnProperty('dataValues') && !_.isUndefined(data.dataValues) && data.dataValues.hasOwnProperty('table_Enrollments')){
        let respObj=[];
        _.each(data.dataValues.table_Enrollments, function(record){
            respObj.push(record['dataValues'])
        });
        let user_firstname; 
        let user_lastname; 
        if(data.dataValues.hasOwnProperty('first_name') && !_.isNull(data.dataValues.first_name)){
         user_firstname = data.dataValues.first_name;
        }
        if(data.dataValues.hasOwnProperty('last_name') && !_.isNull(data.dataValues.last_name)){
         user_lastname = data.dataValues.last_name;
        }

        if(respObj.length > 0){
          _.each(respObj, function(record){
            if(!_.isUndefined(user_firstname)){
              record['user_firstname']=user_firstname;
            }
            if(!_.isUndefined(user_lastname)){
              record['user_lastname']=user_lastname;
            }
            if(record.date_to && !_.isUndefined(record.date_to) && !_.isNull(record.date_to)){
               record['date_to'] = record['date_to'].toISOString().slice(0,10);
            }
            if(record.date_from && !_.isUndefined(record.date_from) && !_.isNull(record.date_from)){
              record['date_from'] = record['date_from'].toISOString().slice(0,10);
            }
            if(record.updated_at && !_.isUndefined(record.updated_at) && !_.isNull(record.updated_at)){
              record['updated_at'] = record['updated_at'].toISOString().slice(0,10);
            } 
          });
          let data_arr = []
          data_arr.push(respObj[0]);
          callback(null, data_arr);
        }else{
          callback(null, respObj)
        }
      }
    }else{
      callback(null);
    }
  }).catch(function(error){
      callback(error)
  });
}


exports.getUserPcpData = function(id , callback){
  models.table_User.findOne({ where: {UserID: id} ,
    include: [
      { model: models.table_PCP}
    ],
    order: [
     [models.table_PCP , 'createdAt', 'DESC' ]
    ],
    attributes:['UserID']
  }).then(data => {
    if(data){
      if(!_.isUndefined(data)){
        let UserID;
        UserID = data.dataValues['UserID'];
        if(data.dataValues.hasOwnProperty('table_PCPs')){
          let respObj = [];
          _.each(data.dataValues.table_PCPs, function(pcpRecord){
            respObj.push(pcpRecord['dataValues'])
          })

          if(respObj.length > 0){
            _.each(respObj, function(record){
              if(record.updated_at && !_.isUndefined(record.updated_at) && !_.isNull(record.updated_at)){
               record['updated_at'] = record['updated_at'].toISOString().slice(0,10);
              }
                record['UserID'] = UserID;
                delete record['table_AssignPCP'];
            });
             let data_arr = []
             data_arr.push(respObj[0]);
             callback(null, data_arr)
          }else{
             callback(null, respObj)
          }
        }
      }
    }else{
      callback(null);
    }
  }).catch(function(error){
      callback(error)
  });
}


exports.getUserInfo = function(id, callback){
  models.table_User.findOne({ where: {UserID: id}
  }).then(user => {
    if(user){
      callback(null, user)
    }else{
      callback(null);
    }
  }).catch(function(error){
      callback(error)
  });
}