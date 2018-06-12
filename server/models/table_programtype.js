'use strict';
module.exports = function(sequelize, DataTypes) {
  var table_ProgramType = sequelize.define('table_ProgramType', {
    ProgramID:{
      type:DataTypes.INTEGER,
      primaryKey: true,
      allowNull:false,
      autoIncrement: true
    },
    ProgramCode:{
      type:DataTypes.STRING(100)
    },
    GroupCode:{
      type:DataTypes.STRING(100)
    },
    UpdatedBy:{
     type:DataTypes.STRING(15),
     allowNull:false
    },
    DateUpdated:{
      type:DataTypes.DATE,
      allowNull:false
    },
    notes:{
     type:DataTypes.STRING(65535)
    }
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });
  return table_ProgramType;
};