'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('table_ProgramTypes', {
      ProgramID:{
        type:Sequelize.INTEGER,
        primaryKey: true,
        allowNull:false,
        autoIncrement: true
      },
      ProgramCode:{
        type:Sequelize.STRING(100)
      },
      GroupCode:{
        type:Sequelize.STRING(100)
      },
      UpdatedBy:{
        type:Sequelize.STRING(15),
        allowNull:false
      },
      DateUpdated:{
        type:Sequelize.DATE,
        allowNull:false
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
    return queryInterface.dropTable('table_ProgramTypes');
  }
};