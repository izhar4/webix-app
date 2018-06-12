'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('table_CorrespondenceTypes', {
      CorrespondenceID: {
        type:  Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull:false,
        references: {
          model: 'table_Correspondences',
          key: 'CorrespondenceID'
        }
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      letter_name:{
        type:Sequelize.STRING(100)
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
    return queryInterface.dropTable('table_CorrespondenceTypes');
  }
};