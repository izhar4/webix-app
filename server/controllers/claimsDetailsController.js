var models                  = require('../models/index');
var _                       = require('underscore');
var date_converter_helper   = require('../helper/date_helper');


/**
Function to save cliam details of new user or else update existing user
*/
exports.saveClaimsDetails = function(req, res){
	let data = req.body;
  console.log('data')
  console.log(data)
  if(data){
    if(data.claimDateofService){
      data['claimDateofService'] = date_converter_helper.date_convert_to_IST(data.claimDateofService);
    }else{
      delete data['claimDateofService'];
    }
    if(data.user_id){
      data["UserID"] = parseInt(data.user_id)
    }
    if(data.allowedAMT){
      data['allowedAMT'] = parseInt(data['allowedAMT']);
    }
    else{
      delete data['allowedAMT'];
    }
    if(data.paidAMT){
      data['paidAMT'] = parseInt(data['paidAMT']);
    }
    else{
      delete data['paidAMT'];
    }
    if(data.ClaimID){
      data.ClaimID = parseInt(data.ClaimID)
      models.table_ClaimsDetail.update(data, {where: { ClaimID: parseInt(data.ClaimID) } ,returning: true, raw:true}).then(data =>{
        if(data && data.length >0){
          if(data[0] == 1){
            let dataObj={};
            dataObj = data[1][0];
            let userId = dataObj['UserID'];
            findAggregateData(req, res, userId, dataObj)
          }else{
            res.status(200).json("No record found");
          }
        }else{
          res.status(404).json({msg:"No record found"})
        }
      }).catch(err =>{
        res.status(400).json(err)
      })
    }else{
      models.db_model.saveData(models.table_ClaimsDetail, data, function(err, data){
        if(err){
         res.status(400).json(err);
        }else if(data && data.hasOwnProperty('dataValues')){
          let respData={};
          let userId;
          respData = data.dataValues
          if(respData && Object.keys(respData).length > 0){
            userId = respData['UserID'];
            findAggregateData(req, res, userId, respData);
          }
        }else{
          res.status(404).json("No record found")
        }
      })
    }
	}
}


/**
Function to fetch claim details of particular user
*/
exports.fetchClaimDetails = function(req, res){
  let id = req['params']['id'];
  if(id){
    models.table_ClaimsDetail.findAll({ where: {UserID: id},
     include:[
      {model: models.table_User,attributes:['first_name','last_name','subscriber_id']}
     ],
     raw:true
    }).then(data => {
      if(data && data.length > 0){
        let respObj =[];
        _.each(data, function(record){
          record['user_id'] = record['UserID'];
          delete record['UserID'];
          if(record['table_User.first_name']){
            // record['UserID'] = record['table_User.first_name']
            record['user_firstname'] = record['table_User.first_name']
            delete record['table_User.first_name'];
          }
          if(record['table_User.last_name']){
            record['user_lastname'] = record['table_User.last_name']
            delete record['table_User.last_name'];
          }
          if(record['table_User.subscriber_id']){
            record['subscriber_id'] = record['table_User.subscriber_id']
            delete record['table_User.subscriber_id'];
          }
          if(record['claimDateofService']){
             record['claimDateofService'] = record['claimDateofService'].toISOString().slice(0,10);
          }
          respObj.push(record)
        })
       res.status(200).json(respObj)
      }else{
        res.status(200).json([]);
      }
    }).catch(err => {
      res.status(400).json(err)
    })
  }
}


/*
Function to group claim data on basis of month
**/
exports.getClaimDetailsByMonth = function(req, res){
 let id = req.params['id'];
  if(id){
    models.table_ClaimsDetail.findAll({ where: {UserID: id},
      attributes: [
       [ models.sequelize.fn('date_trunc', 'month', models.sequelize.col('claimDateofService')), 'month'],
       [models.sequelize.fn('sum', models.sequelize.col('paidAMT')), 'totalClaimPaidAmt']
      ],
      group: 'month',
      raw: true
    }).then(data =>{
      if(data){
        _.each(data, function(record){
          let month;
          if(record['month']){
            month = record['month'].getMonth() + 1;
            record['month'] = month;
          }
        })
        res.status(200).json(data);
      }
    }).catch(err =>{
       res.status(400).json(err);
    })

  }
}


/**
 Function to find totalClaimPaidAmt , totalPaidClaimsCount from table_ClaimsDetail,
* @param req : request Object
* @param res : response Object
* @param userId : Id of user
* @param dataObj : saved or updated claimdetails object
*/
var findAggregateData = function(req, res, userId, dataObj){
  if(userId){
    models.table_ClaimsDetail.findAndCountAll({ where: {UserID: userId},
      group: ['UserID'],
      attributes: ['UserID', [models.sequelize.fn('sum', models.sequelize.col('paidAMT')), 'totalClaimPaidAmt']]
      ,raw:true
    }).then(data => {
      let updateObj={};
      if(data && Object.keys(data).length > 0){
        let totalUserClaimPaidAmt;
        let totalUserPaidClaimsCount;
        if(data['count']){
          totalUserPaidClaimsCount =parseInt(data['count'][0]['count']);
          updateObj['totalPaidClaimsCount'] = totalUserPaidClaimsCount;
        }
        if(data['rows']){
          totalUserClaimPaidAmt = parseInt(data['rows'][0]['totalClaimPaidAmt']);
          updateObj['totalClaimPaidAmt'] = totalUserClaimPaidAmt;
        }
        updateObj['UserID'] = userId;
        updateClaimData (req, res, updateObj, dataObj);
      }
    }).catch(err =>{
      res.status(400).json(err);
    })
  }
}


/**
 Function to update or insert in table_ClaimsData,
* @param req : request Object
* @param res : response Object
* @param updateObj : payload to update or insert in table_ClaimsData
* @param dataObj : saved or updated claimdetails object
*/
var updateClaimData = function (req, res, updateObj, dataObj){
  if(updateObj && Object.keys(updateObj).length > 0){
    let id = updateObj['UserID'];
    models.table_ClaimsData.findOne({where: { UserID: id } }).then(data =>{
      if(data){
        models.table_ClaimsData.update(updateObj , {where: { UserID: id }, returning: true })
         .then(function (record) {
           res.status(200).json(dataObj);
        }).catch(function (error){
          res.status(400).json(error);
        });
      }else{
        models.table_ClaimsData.create(updateObj)
         .then(function (data) {
          res.status(200).json(dataObj)
        })
        .catch(function (error){
          res.status(400).json(error);
        });
      }
    }).catch(err => {
      res.status(400).json(err)
    })
  }else{
    res.status(404).json({msg:"claim data update object null"})
  }
}

