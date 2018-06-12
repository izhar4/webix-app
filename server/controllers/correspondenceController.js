var models                  = require('../models/index');
var date_converter_helper   = require('../helper/date_helper');
var _                       = require('underscore');


exports.fetchCorrespondence = function(req,res){
  models.table_Correspondence.findAll({
    include: [
      { model: models.table_CorrespondenceType, attributes:['letter_name']},
      {model: models.table_User, attributes:['first_name','last_name','subscriber_id']}
    ],
    raw:true
  }).then(function(data) {
    if(data && data.length > 0){
      let respObj=[];
      _.each(data, function(record){
        if(record['table_CorrespondenceType.letter_name']){
          record['letter_name'] = record['table_CorrespondenceType.letter_name'];
          delete record['table_CorrespondenceType.letter_name'];
        }
        if(record['table_User.first_name']){
          record['user_firstname'] = record['table_User.first_name'];
          delete record['table_User.first_name'];
        }
        if(record['table_User.last_name']){
          record['user_lastname']= record['table_User.last_name']
          delete record['table_User.last_name'];
        }
        if(record.date_sent){
          record['date_sent'] = record['date_sent'].toISOString().slice(0,10);
        }
        if(record.updated_at){
          record['updated_at'] = record['updated_at'].toISOString().slice(0,10);
        }
        if(record['table_User.subscriber_id']){
          record['subscriber_id'] = record['table_User.subscriber_id']
          delete record['table_User.subscriber_id']
        }
        if(record['table_CorrespondenceType.letter_name']){
          record['letter_name'] = record['table_CorrespondenceType.letter_name']
        }
        delete record['table_CorrespondenceType.letter_name']
        if(record['UserID']){
          record['user_id'] = record['UserID'];
          delete record['UserID'];
        }
        respObj.push(record)
      })
      res.status(200).json(respObj)
    }else{
      res.status(200).json([]);
    }
  }).catch(function(err){
    res.status(400).json(err);
  });
}


exports.fetchCorrespondenceType = function(req,res){
  models.table_CorrespondenceType.findAll({raw: true}).then(data => {
    if(data){
      _.each(data, function(record){
        record['updated_at'] = record['updated_at'].toISOString().slice(0,10);;
      })
      res.status(200).json(data);
    }else{
      res.status(200).json([]);
    }
  }).catch(function(error){
      res.status(400).json(error)
  });
}


exports.deleteCorrespondence = function(req,res){
  let id = parseInt(req.params.id);
  if(id){
    models.table_Correspondence.destroy({ where: {CorrespondenceID: id }}).then(function(data){
      if(data){
        res.status(200).json("Correspondence Deleted");
      }else{
        res.status(404).json("No record found")
      }
    }).catch(function(error){
        res.status(400).json(err);
    })
  }else{
    res.status(404).json("invalid CorrespondenceID")
  }
}


exports.updateCorrespondence= function(req,res){
  let data = req.body;
  let typeId;
  if(data.user_id){
    data.UserID = parseInt(data.user_id);
  }
  delete data['user_id'];
  if(data.date_sent){
    data['date_sent'] = date_converter_helper.date_convert_to_IST(data.date_sent);
  }else{
    delete data.date_sent;
  }
  if(data.updated_at){
    data['updated_at'] = date_converter_helper.date_convert_to_IST(data.updated_at);
  }else{
    delete data.updated_at;
  }
  delete data['user_firstname']
  delete data['user_lastname']
  delete data['subscriber_id']
  delete data['id']
  delete data['webix_operation']
  if(data && Object.keys(data).length > 0 && data.CorrespondenceID){
    let id = parseInt(data.CorrespondenceID);
    models.table_Correspondence.update(data, {where: { CorrespondenceID: id }, returning: true, raw:true }).then(record => {
      if(record && record[0] == 1){
        updateCorrespondenceType(req, res, record[1][0]);
      }else{
        res.status(404).json("No record found");
      }
    }).catch(err => {
      res.status(400).json(err);
    })
  }else if(data && Object.keys(data).length > 0){
    models.table_Correspondence.create(data).then(function (data) {
      if(data){
        updateCorrespondenceType(req, res, data.dataValues);
      }else{
        res.status(404).json("No record found")
      }
    }).catch(function (error){
      res.status(400).json(error);
    });
  }
}


var updateCorrespondenceType = function(req, res, payloadObj){
  let updateObj = {};
  let respPayload={};
  if(payloadObj && Object.keys(payloadObj).length > 0){
   updateObj['CorrespondenceID'] =parseInt(payloadObj['CorrespondenceID'])
    if(payloadObj.letter_name){
      updateObj['letter_name'] = payloadObj['letter_name'];
    }
    if(payloadObj.updated_by){
      updateObj['updated_by'] = payloadObj['updated_by'];
    }
    if(payloadObj.updated_at){
    updateObj['updated_at'] = payloadObj['updated_at']
    }
    respPayload['correspondence'] = payloadObj;
    models.table_CorrespondenceType.findOne({where: {CorrespondenceID :parseInt(payloadObj['CorrespondenceID'])}, raw:true}).then(data =>{
      createCorrespondenceType(req, res, data, updateObj, respPayload);
    }).catch(err =>{
      res.status(400).json(err);
    })
  }
}


const createCorrespondenceType = function(req, res, data, updateObj, respPayload){
  if(data){
    models.table_CorrespondenceType.update(updateObj, {where :{CorrespondenceID: updateObj['CorrespondenceID']}, returning: true, raw: true}).then(resp =>{
      if(resp[0] == 1){
        respPayload['msg']= "CorrespondenceType updated successfully";
      }else{
        respPayload['msg']= "CorrespondenceType with id " +typeId+" doesn't exists";
      }
      res.status(200).json(respPayload);
      }).catch(err =>{
        res.status(400).json(err);
      })
  }else{
    models.table_CorrespondenceType.create( updateObj ).then(resp =>{
      respPayload['msg'] = "CorrespondenceType created successfully";
      res.status(200).json(respPayload);
    }).catch(err =>{
      res.status(400).json(err);
    })
  }
}
