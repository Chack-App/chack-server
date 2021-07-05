const { db } = require('../server/db');
const { User, Item } = require('../server/db/models');

async function seed() {
  await db.sync({ force: true });
  console.log('db synced!');

  const users = await Promise.all([
    User.create({ username: 'andrew', password: '123' }),
    User.create({ username: 'jason', password: '123' }),
    User.create({ username: 'david', password: '123' }),
    User.create({ username: 'cody', password: '123' }),
  ]);

  console.log(`seeded ${users.length} users`);

  const items = await Promise.all([
    Item.create({
      name: 'French Fries',
      price: 999,
    }),
    Item.create({
      name: 'Calamari',
      price: 1399,
    }),
    Item.create({
      name: 'Poke Nachos',
      price: 1699,
    }),
    Item.create({
      name: 'Stella Artois',
      price: 699,
    }),
  ]);

  console.log(`seeded ${items.length} items`);

  console.log(`seeded successfully`);
}

async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

if (module === require.main) {
  runSeed();
}

module.exports = seed;
