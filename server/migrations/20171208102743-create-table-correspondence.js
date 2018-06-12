'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('table_Correspondences', {
      UserID: {
        type:  Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull:false,
        references: {
          model: 'table_Users',
          key: 'UserID'
        }
      },
      date_sent:{
        type:Sequelize.DATE,
        allowNull:false,
        defaultValue: Sequelize.NOW
      },
      CorrespondenceID:{
        type:Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      updated_by:{
        type:Sequelize.STRING(15),
        allowNull:false
      },
      updated_at:{
        type:Sequelize.DATE,
        allowNull:false,
        defaultValue: Sequelize.NOW
      },
      notes:{
        type:Sequelize.STRING(65535)
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
    return queryInterface.dropTable('table_Correspondences');
  }
};