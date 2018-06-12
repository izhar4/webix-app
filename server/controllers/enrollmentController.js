var models                  =                require('../models/index');
var date_converter_helper   = require('../helper/date_helper');
var _                       = require('underscore');


exports.fetchEnrollment = function(req,res){
  models.table_Enrollment.findAll({
    include: [{ model: models.table_User}]
  }).then(function(data) {
    if(data){
      let respObj=[];
      _.each(data, function(record){
        let first_name;
        let last_name;
        if(record.dataValues){
          if( record.dataValues.table_User && record.dataValues.table_User.UserID){
            record['dataValues']['user_id'] =  record['dataValues']['table_User']['UserID'];
          }
          if(record.dataValues.table_User && record.dataValues.table_User.last_name){
            record['dataValues']['user_lastname'] = record['dataValues']['table_User']['last_name'];
          }
          if(record.dataValues.table_User && record.dataValues.table_User.subscriber_id){
            record['dataValues']['subscriber_id'] = record['dataValues']['table_User']['subscriber_id'];
          }
          delete record['dataValues']['table_User'];

          if(record.dataValues.date_to){
            record['dataValues']['date_to'] = record['dataValues']['date_to'].toISOString().slice(0,10);
          }
          if(record.dataValues.date_from){
            record['dataValues']['date_from'] = record['dataValues']['date_from'].toISOString().slice(0,10);
          }
          if(record.dataValues.updated_at){
            record['dataValues']['updated_at'] = record['dataValues']['updated_at'].toISOString().slice(0,10);
          }
          respObj.push(record['dataValues']);
        }
      });
      res.status(200).json(respObj)
    }else{
      res.status(200).json([])
    }
  }).catch(function(err){
    res.status(400).json(err);
  });
}


exports.updateEnrollment = function(req,res){
  let data = req.body;
  if(data.user_id){
    data.UserID = parseInt(data.user_id);
  }
  delete data['user_firstname']
  delete data['user_lastname']
  if(data.date_to){
    data['date_to'] = date_converter_helper.date_convert_to_IST(data.date_to);
  }else{
    delete data.date_to;
  }
  if(data.date_from){
    data['date_from'] = date_converter_helper.date_convert_to_IST(data.date_from);
  }else{
      delete data.date_from;
  }
  if(data.updated_at){
    data['updated_at'] = date_converter_helper.date_convert_to_IST(data.updated_at);
  }else{
    delete data.updated_at;
  }
  delete data['user_id']
  if(data && Object.keys(data).length > 0 && data.EnrollID){
    let enrollId = parseInt(req.body.EnrollID);
    models.table_Enrollment.update(data, {where: { EnrollID: enrollId } }).then(record => {
      if(record[0] < 1){
        res.status(404).json("No record found")
      }else{
         res.status(200).json(record[0]);
        }
    }).catch(err => {
      res.status(400).json(err);
    })
  }else if(data && Object.keys(data).length > 0){
    if(data.UserID){
      data.UserID = parseInt(data.UserID);
    }
    if(data.ProgramID){
      data.ProgramID = parseInt(data.ProgramID);
    }
    models.db_model.saveData(models.table_Enrollment, data, function(err,data){
      if(err){
        res.status(400).json(err);
      }else if(data && data.hasOwnProperty('dataValues')){
        res.status(200).json(data.dataValues);
      }else{
          res.status(404).json("No record found")
      }
    })
  }
}


exports.deleteEnrollmentById = function(req,res){
  let id = parseInt(req.params.id);
  if(id){
    models.table_Enrollment.destroy({ where: {EnrollID: id }}).then(function(data){
      if(data){
        res.status(200).json("Enrollment Deleted");
      }else{
        res.status(200).json("No record found")
      }
    }).catch(function(error){
      res.status(400).json(error);
    })
  }
}
