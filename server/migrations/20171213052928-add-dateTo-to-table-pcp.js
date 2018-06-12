'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn( 'table_PCPs', 'dateTo', Sequelize.DATE );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn( 'table_PCPs', 'dateTo');
  }
};
