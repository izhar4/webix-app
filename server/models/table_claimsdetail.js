'use strict';
module.exports = function(sequelize, DataTypes) {
  var table_ClaimsDetail = sequelize.define('table_ClaimsDetail', {
    ClaimID:{
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    allowedAMT: DataTypes.BIGINT,
    paidAMT: DataTypes.BIGINT,
    diagnosisCode: DataTypes.STRING(15),
    procedureCode: DataTypes.STRING(15),
    claimDateofService:{
     type: DataTypes.DATE
    }
  },
    {
      classMethods: {
        associate: function(models) {
          table_ClaimsDetail.belongsTo(models.table_User,{foreignKey : 'UserID', onDelete: 'CASCADE'});
        }
      }
    }
  );
  return table_ClaimsDetail;
};