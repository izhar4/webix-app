'use strict';
module.exports = function(sequelize, DataTypes) {
  var table_ClaimsData = sequelize.define('table_ClaimsData', {
    totalClaimPaidAmt:{
      type:DataTypes.BIGINT
    },
    totalPaidClaimsCount:{
      type:DataTypes.INTEGER
    }
  },
    {
      classMethods: {
        associate: function(models) {
        table_ClaimsData.belongsTo(models.table_User,{foreignKey : 'UserID', onDelete: 'CASCADE'});
        }
      }
    }
  )
  return table_ClaimsData;
};
