'use strict';
module.exports = function(sequelize, DataTypes) {
  var table_CorrespondenceType = sequelize.define('table_CorrespondenceType', {
    letter_name:{
      type:DataTypes.STRING(100)
    },
    updated_by:{
      type:DataTypes.STRING(15),
      allowNull:false
    },
    updated_at:{
      type:DataTypes.DATE,
      allowNull:false,
      defaultValue: DataTypes.NOW
    },
    notes:{
      type:DataTypes.STRING(65535)
    }
  },
    {
      classMethods: {
        associate: function(models) {
         table_CorrespondenceType.belongsTo(models.table_Correspondence,{foreignKey : 'CorrespondenceID', onDelete: 'CASCADE'});
         
        }
      }
  })
  return table_CorrespondenceType;
};