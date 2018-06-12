'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn( 'table_PCPs', 'dateFrom', Sequelize.DATE );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn( 'table_PCPs', 'dateFrom');
  }
};
