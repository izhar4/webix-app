'use strict';
module.exports = function(sequelize, DataTypes) {
  var table_Enrollment = sequelize.define('table_Enrollment', {
    EnrollID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    date_from:{
      type:DataTypes.DATE,
      allowNull:false,
      defaultValue: DataTypes.NOW
    },
    date_to:{
      type:DataTypes.DATE
    },
    ProgramID:{
      type: DataTypes.INTEGER,
      allowNull:false
    },
    updated_by:{
      type:DataTypes.STRING(15),
      allowNull: false
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
        table_Enrollment.belongsTo(models.table_User, {
          foreignKey: 'UserID',
          onDelete: 'CASCADE'
        });
      }
    }
  });
  return table_Enrollment;
};