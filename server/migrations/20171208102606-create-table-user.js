'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('table_Users', {
      UserID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      subscriber_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      first_name:{
        type: Sequelize.STRING(50)
      },
      last_name:{
        type: Sequelize.STRING(50),
        allowNull: false
      },
      role:{
        type: Sequelize.STRING(5),
        allowNull: false
      },
      gender:{
        type: Sequelize.STRING(5),
        allowNull: false
      },
      address_1:{
        type: Sequelize.STRING(50)
      },
      address_2:{
        type: Sequelize.STRING(100)
      },
      city:{
        type: Sequelize.STRING(50)
      },
      state:{
        type: Sequelize.STRING(50)
      },
      zipcode:{
        type: Sequelize.STRING(10)
      },
      email:{
        type: Sequelize.STRING(65535)
      },
      phone:{
        type: Sequelize.STRING(15),
        allowNull: false
      },
      updated_by:{
        type: Sequelize.STRING(15),
        allowNull: false
      },
      updated_at:{
        type:Sequelize.DATE,
        allowNull:false,
        defaultValue: Sequelize.NOW
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
    return queryInterface.dropTable('table_Users');
  }
};