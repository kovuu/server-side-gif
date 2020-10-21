'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'name', {
      type: Sequelize.STRING,
      unique: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'name', {
      type: Sequelize.STRING,
      unique: false
    })
  }
};
