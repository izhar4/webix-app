'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('table_ClaimsData', {
      UserID: {
        type:  Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull:false,
        references: {
          model: 'table_Users',
          key: 'UserID'
        }
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      totalClaimPaidAmt:{
        type:Sequelize.BIGINT
      },
      totalPaidClaimsCount:{
        type:Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('table_ClaimsData');
  }
};