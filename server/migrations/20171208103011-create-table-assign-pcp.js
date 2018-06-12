'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('table_AssignPCPs', {
      UserID: {
        type:  Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull:false,
        references: {
          model: 'table_Users',
          key: 'UserID'
        }
      },
      PCPID: {
        type:  Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull:false,
        references: {
          model: 'table_PCPs',
          key: 'PCPID'
        }
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dateFrom:{
        type:Sequelize.DATE,
        allowNull:false,
        defaultValue: Sequelize.NOW
      },
      updated_by:{
        type:Sequelize.STRING(15)
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
    return queryInterface.dropTable('table_AssignPCPs');
  }
};
