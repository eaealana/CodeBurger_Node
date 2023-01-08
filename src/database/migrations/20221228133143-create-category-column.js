'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    //! add column category
    await queryInterface.addColumn('products', 'category_id', {
      type: Sequelize.INTEGER,
      references: { model: 'categories', key: 'id'},
      onUpdate:  'CASCADE',
      onDelete: null,
      allowNull: true,
    })
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('products', 'category_id')
  },
}
