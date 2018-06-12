'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('table_ClaimsDetails', {
      UserID: {
        type:  Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull:false,
        references: {
          model: 'table_Users',
          key: 'UserID'
        }
      },
      ClaimID:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      allowedAMT: Sequelize.BIGINT,
      paidAMT: Sequelize.BIGINT,
      diagnosisCode: Sequelize.STRING(15),
      procedureCode: Sequelize.STRING(15),
      claimDateofService:{
       type: Sequelize.DATE
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
    return queryInterface.dropTable('table_ClaimsDetails');
  }
};