var models                    = require('../models/index');
var date_converter_helper     = require('../helper/date_helper');
const _                       = require('underscore');
var async                     = require('async');


exports.fetchAssignPCP = function(req,res){
  let condition = {raw: true,
    attributes:['dateFrom','dateTo', 'updated_by', 'updated_at', 'notes', 'PCPID', 'UserID', 'id']
  };
  assignPcp(condition, function(err, data){
    if(err){
      res.status(400).json(err)
    }
    else if(data && data.length > 0){
      async.eachSeries(data, function(record , callback1){
        models.table_User.findOne({where: {UserID : record['UserID']}, attributes:['first_name'], raw:true}).then( userData =>{
          if(userData && userData['first_name']){
            record['user_firstname'] = userData['first_name'];
          }
          callback1();
        }).catch(err =>{
          callback1(err);
        })
      },function(err){
        if(err){
          res.status(400).json(err);
        }else{
          res.status(200).json(data)
        }
      })
    }else{
     res.status(200).json([])
    }
  })
}


exports.fetchAssignPCPByUser = function(req, res){
  let UserID = req.params.id;
  let condition ={};
  condition= { where:{UserID :UserID},raw:true}
  assignPcp(condition, function(err, data){
    if(err){
      res.status(400).json(err)
    }
    else if(data && data.length > 0){
       res.status(200).json(data)
    }else{
     res.status(200).json([])
    }
  })
}


exports.fetchPCP = function(req,res){
  models.table_PCP.findAll().then(function(data) {
      if(data){
        let respObj =[];
        _.each(data, function(record){
          if(record.dataValues){
           respObj.push(record['dataValues']);
          }
        })
        if(respObj.length > 0){
          _.each(respObj, function( record){
            if(record.updated_at){
              record['updated_at'] = record['updated_at'].toISOString().slice(0,10);
            }
            if(record.dateFrom){
              record['dateFrom'] = record['dateFrom'].toISOString().slice(0,10);
            }
            if(record.dateTo){
              record['dateTo'] = record['dateTo'].toISOString().slice(0,10);
            }
          })
          modifyPcpPayload(respObj, function(err, data){
            if(err){
              res.status(400).json(err);
            }else if(data){
              res.status(200).json(data)
            }else{
              res.status(200).json([]);
            }
          });
          
        }else{
          res.status(200).json(respObj);
        }
      }else{
          res.status(200).json([]);
       }
    }).catch(function(err){
        res.status(400).json(err);
    });
}


exports.deletePCP = function(req,res){
  let id = parseInt(req.params.id);
  if(id){
    models.table_PCP.destroy({ where: {PCPID: req.params.id }}).then(function(data){
      if(data){
        res.status(200).json("PCP Deleted");
      }else{
        res.status(404).json("No record found")
      }
    }).catch(function(error){
        res.status(400).json(err);
    })
  }
}


exports.updatePCP = function(req,res){
  let data = req.body;
  let UserID;
  if(data.user_id){
    UserID = data.user_id;
    delete data['user_id'];
  }else{
     UserID = data['UserID'];
     delete data['UserID']
  }
  models.table_User.findAll({where:{UserID:parseInt(UserID)}, raw:true, attributes:['first_name']}).then( userData=>{
    console.log("userdAt  ",userData)
    if(data.updated_at){
      data['updated_at'] = date_converter_helper.date_convert_to_IST(data.updated_at)
    }else{
      delete data.updated_at;
    }
    if(data.dateFrom){
      data['dateFrom'] = date_converter_helper.date_convert_to_IST(data.dateFrom)
    }else{
      delete data.dateFrom;
    }
    if(data.dateTo){
      data['dateTo'] = date_converter_helper.date_convert_to_IST(data.dateTo)
    }else{
      delete data['dateTo']
    }
    if(data.webix_operation){
      delete webix_operation
    }
    if(userData && userData.length > 0){
      data['pcp_first_name'] = userData[0]['first_name'];
    }
    if(data && Object.keys(data).length > 0 && data.PCPID){
      let id = parseInt(req.body.PCPID);
      models.table_PCP.update(data, {where: { PCPID: id }, returning: true, raw:true}).then(record => {
        if(record && record[0] == 1){
          updateAssignPCP(req, res, UserID, record[1][0]);
        }else{
          res.status(404).json("No record found");
        }
      }).catch(err => {
         res.status(400).json(err);
      })
    }else if(data && Object.keys(data).length > 0){
      models.table_PCP.create(data).then(function (data) {
        if(data){
          updateAssignPCP(req, res, UserID, data.dataValues);
        }else{
          res.status(404).json("No record found")
        }
      }).catch(function (error){
        res.status(400).json(error);
      });
    }
  }).catch(err =>{
     res.status(400).json(err);
  })
}


const updateAssignPCP = function(req, res, UserID, pcpPayload){
  if(UserID && pcpPayload && Object.keys(pcpPayload).length > 0){
    let assignPcpObj = {};
    assignPcpObj = createAssignPcpPayload(pcpPayload, UserID);
    if(assignPcpObj && Object.keys(assignPcpObj).length >0){
      models.table_AssignPCP.findOne({where: {UserID:assignPcpObj.UserID, PCPID: assignPcpObj.PCPID}, raw:true}).then(data =>{
        createAssignPcp(req, res, assignPcpObj, data, pcpPayload);
      }).catch(err =>{
       res.status(400).json(err);
      })
    }
  }else{
    res.status(404).json("UserID or pcpPayload not present, cannot update assign pcp")
  }
}


const createAssignPcpPayload = function(pcpPayload, UserID){
  let payloadObj = {};
  payloadObj['dateFrom']   = pcpPayload.dateFrom;
  payloadObj['updated_at'] = pcpPayload.updated_at;
  payloadObj['updated_by'] = pcpPayload.updated_by;
  payloadObj['UserID']     = UserID;
  payloadObj['PCPID']      = pcpPayload['PCPID'];
  if(pcpPayload.dateTo){
    payloadObj['dateTo'] = pcpPayload.dateTo;
  }
  if(pcpPayload.notes){
    payloadObj['notes'] = pcpPayload.notes;
  }
  return payloadObj;
}


const createAssignPcp = function(req, res, assignPcpObj, data, pcpPayload){
  let respObj ={};
  respObj['pcpPayload']= pcpPayload;
  if(data){
    models.table_AssignPCP.update(assignPcpObj, {where: {UserID:assignPcpObj.UserID, PCPID: assignPcpObj.PCPID}, returning:true, raw:true}).then(resp =>{
      if(resp && resp[0] == 1){
        respObj['msg'] = "assignPcp updated successfully"
        res.status(200).json(respObj)
      }else{
        res.status(404).json("assignPcp not updated");
      }
    }).catch(err =>{
        res.status(400).json(err);
    })
  }else{
    models.table_AssignPCP.create(assignPcpObj).then(data =>{
      if(data){
        respObj['msg'] = "assignPcp created successfully";
        res.status(200).json(respObj);
      }else{
        res.status(404).json("assignPcp not created");
      }
    }).catch(err =>{
        res.status(400).json(err);
    })
  }
}


const assignPcp = function(condition , callback){
  models.table_AssignPCP.findAll(condition).then( resp=>{
    if(resp && resp.length > 0){
      _.each(resp, function(record){
        record['dateFrom'] = record['dateFrom'].toISOString().slice(0,10);
        record['updated_at'] = record['updated_at'].toISOString().slice(0,10);
        if(record['dateTo']){
          record['dateTo'] = record['dateTo'].toISOString().slice(0,10);
        }
      })
      callback(null, resp)
    }else{
      callback(null)
    }
  }).catch(err =>{
     callback(err);
  })
}


const  modifyPcpPayload = function(data, callback){
  async.eachSeries(data, function(record , callback1){
    models.table_AssignPCP.findOne({where: {PCPID : record['PCPID']}, attributes:['UserID'], raw:true}).then( userData =>{
      if(userData && userData['UserID']){
       record['user_id'] = userData['UserID'];
      }
      callback1();
    }).catch(err =>{
      callback1(err);
    })
  },function(err){
    if(err){
      callback(err);
    }else{
      callback(null, data)
    }
  })
}
