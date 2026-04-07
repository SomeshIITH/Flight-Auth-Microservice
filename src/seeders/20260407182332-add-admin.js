'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // We must manually hash because seeders bypass Model Hooks
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await queryInterface.bulkInsert('Users', [{
      email: 'admin@flights.com',
      password: hashedPassword,
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    // This allows you to "undo" the seed if needed
    await queryInterface.bulkDelete('Users', { email: 'admin@flights.com' }, {});
  }
};
