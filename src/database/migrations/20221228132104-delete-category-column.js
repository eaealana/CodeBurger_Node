'use strict'

const { Sequelize } = require('sequelize')

module.exports = {
  async up(queryInterface, Sequelize) {
    //! delete column category
    await queryInterface.removeColumn('products', 'category')
  },

  async down(queryInterface) {
    await queryInterface.createColumn('products', {
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    })
  },
}
