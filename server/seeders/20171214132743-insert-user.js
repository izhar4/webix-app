'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
     return queryInterface.bulkInsert('table_Users', [{
      first_name : 'webix',
      last_name : 'Admin',
      subscriber_id : 10000,
      role : 'admin',
      phone : 1000029,
      updated_by : 'admin',
      password : 'password',
      gender : 'male',
      createdAt : new Date(),
      updatedAt : new Date(),
      updated_at : new Date(),
      email : 'webix@admin.com'
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('table_Users', [{
      email :'webix@admin.com'
    }])
  }
};
