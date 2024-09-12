'use strict';

const { faker } = require('@faker-js/faker');

const dummyUser = {
  username: "Pera Peric",
  email: "email@email.com",
  password: "PeraPeraPera",
  createdAt: faker.date.soon(),
  updatedAt: faker.date.soon()
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const userId = await queryInterface.bulkInsert('Users', [dummyUser]);
    const NUMBER_OF_POSTS = 30;
    const posts = [];
    for(let i=0; i < NUMBER_OF_POSTS; i++)
      posts.push(createRandomPost(userId));

    await queryInterface.bulkInsert('Posts', posts);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("users", { username: dummyUser.username });
    await queryInterface.bulkDelete('Posts', null, {});
  }
};

function createRandomPost(userId)
{
  return {
    coverImageUrl: faker.image.avatar(),
    title: faker.word.noun(9),
    description: faker.lorem.sentence(1),
    content: faker.lorem.paragraphs(10),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    userId: userId
  }
}