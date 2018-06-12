var models                  = require('../models/index');
var db_helper               = require('./db_helper');
var _                       = require('underscore');


exports.loginUser=function(req,res){
  let email = req.body.email
  let password = req.body.password
  if(req.body){
    models.table_User.findAll({where:{email: email},raw:true, attributes:['password','email']}).then(function(data) {
      if(data && data.length >0 && data[0].password === password){
        req.session.loggedInUser =  data[0].email
        res.redirect('/userHome');
      }else{
         res.render('login.ejs',{msg:"email or password invalid"})
      }
    }).catch( err=>{
      res.status(400).json(err);
    })
  }
}


exports.userHome = function(req, res){
  res.render('index.ejs', { title: 'Express' });
}


exports.logoutUser=function(req,res){
  delete req.session.loggedInUser
  res.redirect('/')
}


exports.fetchUser= function(req,res){
  if(req.params.hasOwnProperty('id') && req.params.id){
    let id= req.params.id;
    db_helper.getUserInfo (id , function(err, data){
      if(err){
        res.status(400).json(err);
      }else if(!_.isUndefined(data)){
        let respObj =[];
        if(data.dataValues){
          respObj.push(data.dataValues)
        }
        res.status(200).json(respObj)
      }else{
        res.status(404).json("No record found")
      }
    })
 	}
}


exports.getUsers =function(req,res){
  models.table_User.findAll({raw:true, attributes:['UserID','first_name']}).then(function(data) {
    if(data && data.length >0){
      _.each(data, function(record){
        record['id'] = record['UserID'];
        delete record['UserID']
        if(record['first_name']){
          record['value'] = record['first_name'];
          delete record['first_name']
        }
      })
      res.status(200).json(data)
    }else{
      res.status(200).json([])
    }
  }).catch(function(err){
    res.status(400).json(err);
  });
}


/**
Function to get user 'subscriber_id','last_name'
*/
exports.getUserById =function(req,res){
  let id = req.params['id'];
  if(id){
    models.table_User.findAll({where:{UserID: id },raw:true, attributes:['first_name','subscriber_id','last_name']}).then(function(data) {
      if(data && data.length >0){
        res.status(200).json(data)
      }else{
        res.status(404).json("No record found")
      }
    }).catch(function(err){
      res.status(400).json(err);
    });
  }
}


exports.getUsersData = function(req, res){
  models.table_User.findAll().then(function(data){
    let userObj=[];
    _.each(data, function(userData){
      if(userData.dataValues){
        delete userData.dataValues['createdAt'];
        delete userData.dataValues['updatedAt'];
        userObj.push(userData.dataValues)
      }
    });
    if(userObj.length > 0){
      res.status(200).json(userObj);
    }else{
      res.status(200).json([]);
    }
  }).catch(function(err){
    res.status(400).json(err);
  });
}


exports.deleteUserById = function(req,res){
  let id = req.params['id'];
  if(id){
    models.table_User.destroy({ where: {UserID: id }}).then(function(data){
      if(data){
        res.status(200).json("User Deleted");
      }else{
        res.status(200).json("No record found")
      }
    }).catch(function(error){
      res.status(400).json(error);
    })
  }
}


exports.updateUser= function(req,res){
  let data = req.body;
  if(data && data.UserID && Object.keys(data).length > 0){
    let id = parseInt(req.body.UserID)
    data.UserID        = parseInt(data.UserID);
    data.subscriber_id = parseInt(data.subscriber_id);
    if(data.webix_operation){
      delete data['webix_operation'];
    }
    models.table_User.upsert(data, {where: { UserID: id } }).then(record => {
      if(record == false){
        res.status(200).json("user updated")
      }else if(record){
        res.status(200).json("user created");
      }
    }).catch(err => {
      res.status(400).json(err);
    })
  }else if(data && Object.keys(data).length > 0){
    if(data.webix_operation){
      delete data['webix_operation'];
    }
    data.subscriber_id = parseInt(data.subscriber_id);
    models.db_model.saveData(models.table_User, data, function(err,data){
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


exports.getUserPcp = function(req, res){
  if(req.params.hasOwnProperty('id') && !_.isUndefined(req.params.id)){
    let id = parseInt(req.params.id);
    db_helper.getUserPcpData(id, function(err,data){
        if(err){
           res.status(400).json(err);
        }else if(data && !_.isUndefined(data)){
          res.status(200).json(data)
        }else{
          res.status(200).json([])
        }
    })
  }
}


exports.getUserEligibility  = function(req ,res){
  if(req.params.hasOwnProperty('id') && !_.isUndefined(req.params.id)){
    let id = parseInt(req.params.id);
    db_helper.getUserEnrollmentData(id, function(err, data){
      if(err){
        res.status(400).json(err);
      }else if(!_.isUndefined(data) && !_.isNull(data)){
           res.status(200).json(data)
      }else{
         res.status(200).json([])
      }
    })
  }
}


exports.getUserCorrespondence  = function(req ,res){
  if(req.params.hasOwnProperty('id') && !_.isUndefined(req.params.id)){
    let id = parseInt(req.params.id);
    db_helper.getUserCorrespondenceData(id, function(err,data){
      if(err){
         res.status(400).json(err);
      }else if(!_.isUndefined(data) && !_.isNull(data)){
          res.status(200).json(data)
       }else{
          res.status(200).json([]);
       }
    })
  }

}


var getCompleteUserData = function(id, callback){
  models.table_User.findOne({ where: {UserID: id} ,
    include: [
      { model: models.table_Enrollment},
      { model: models.table_Correspondence,
        include: [models.table_CorrespondenceType]
      },
      {
        model : models.table_PCP
      }
    ]
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
