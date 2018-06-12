'use strict';
module.exports = function(sequelize, DataTypes) {
  var table_AssignPCP = sequelize.define('table_AssignPCP', {
    dateFrom:{
      type:DataTypes.DATE,
      allowNull:false,
      defaultValue: DataTypes.NOW
    },
    dateTo:{
      type:DataTypes.DATE
    },
    updated_by:{
      type:DataTypes.STRING(15)
    },
    updated_at:{
      type:DataTypes.DATE,
      allowNull:false,
      defaultValue: DataTypes.NOW
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
  return table_AssignPCP;
};
