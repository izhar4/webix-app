

module.exports =function(){
 
  var saveData=function(model,data,callback){
    model.create(data)
    .then(function (data) {
      callback(null,data)
    })
    .catch(function (error){
      callback(error)
    });
  }


  var deleteByID =function(model,id,callback){
    model.destroy({where: {id:id}}).then(function(data){
        callback(null, data)
    }).catch(function (error){
    	 callback(error)
    })
  }
 
  const findAllData = function(conditions, model, callback){

  }  


  const findById = function(conditions, model, callback){

  } 

  const deleteField = function(conditions, model, callback){

  }

  const update = function(conditions, models, data, callback){

  }

  const findOneField = function(conditions, models, data, callback){
    
  }

  var db_model={name:"db_model", saveData:saveData, deleteByID:deleteByID};
  return db_model;
}