'use strict';
module.exports = function(sequelize, DataTypes) {
  var table_Correspondence = sequelize.define('table_Correspondence', {
    date_sent:{
      type:DataTypes.DATE,
      allowNull:false,
      defaultValue: DataTypes.NOW
    },
    CorrespondenceID:{
      type:DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
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
  },{
      classMethods: {
        associate: function(models) {
          table_Correspondence.belongsTo(models.table_User,{foreignKey : 'UserID', onDelete: 'CASCADE'});
          table_Correspondence.hasOne(models.table_CorrespondenceType,{foreignKey : 'CorrespondenceID', onDelete: 'CASCADE'});
        }
      }
    }
  )
  return table_Correspondence;
};