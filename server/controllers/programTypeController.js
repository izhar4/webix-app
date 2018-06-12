var models = require('../models/index');


exports.saveProgram =function(req,res){
  if(req.body){
     models.db_model.saveData(models.table_ProgramType,req.body,function(err,data){
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


exports.fetchProgram = function(req,res){
  if(req.params.hasOwnProperty('id') && req.params.id){
    models.table_Correspondence.findOne({ where: {ProgramID: req.params.id}
     }).then(data => {
        if(data){
          res.status(200).json(data);
        }else{
          res.status(404).json("No record found")
        }
     }).catch(function(error){
        res.status(400).json(error)
     });
  }
}


exports.deleteProgram = function(req,res){
  if(req.params.hasOwnProperty('id') && req.params.id){
    models.table_ProgramType.destroy({ where: {ProgramID: req.params.id }}).then(function(data){
      if(data){
        res.status(200).json(data);
      }else{
        res.status(404).json("No record found")
      }
    }).catch(function(error){
        res.status(400).json(err);
    })
  }

}


exports.updateProgram = function(req,res){
  if(req.params.hasOwnProperty('id') && req.body){
    let data = req.body;
     models.table_ProgramType.update(data, {where: { ProgramID: req.params.id } }).then(record => {
      if(record[0] < 1){
        res.status(404).json("No record found")
      }else{
        res.status(200).json(record[0]);
      }
     }).catch(err => {
        res.status(400).json(err);
     })
  }
}