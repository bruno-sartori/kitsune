import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.bulkInsert('Users', [{
      name: "Bruno Sartori",
      login: "brunosartori.dev@gmail.com",
      password: "$2a$10$MmHGsvxXz16IfxgvVVZUQew1fM2LlDCBzCXex/mzIPFIYFKzvVodi",
      updatedAt: new Date(),
      createdAt: new Date()
    }]);
  },

  async down (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    return queryInterface.bulkDelete('Users', {}, {});
  }
};
