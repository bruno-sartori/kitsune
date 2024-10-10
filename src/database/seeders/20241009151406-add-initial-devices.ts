import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.bulkInsert('Devices', [
      {
        id: 'b6fdd7ef-8762-4486-9f5a-22b79fe1af5a',
        name: "Razer BlackWidow V4",
        type: "keyboard",
        group: "light",
        userId: 1,
        updatedAt: new Date(),
        createdAt: new Date()
      },
      {
        id: '451e92d3-b39f-4a62-88d7-b44c63afeb00',
        name: "Razer DeathAdder Elite",
        type: "mouse",
        group: "light",
        userId: 1,
        updatedAt: new Date(),
        createdAt: new Date()
      },
    ]);
  },

  async down (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    return queryInterface.bulkDelete('Devices', {}, {});
  }
};
