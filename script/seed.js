const db = require('../server/db/db');
const { User, Event, Item } = require('../server/db');

async function seed() {
  await db.sync({ force: true });
  console.log('db synced!');

  const users = await Promise.all([
    User.create({ username: 'andrew', password: '123' }),
    User.create({ username: 'jason', password: '123' }),
    User.create({ username: 'david', password: '123' }),
    User.create({ username: 'cody', password: '123' }),
  ]);

  const events = await Promise.all([
    Event.create({
      eventName: 'Dinner',
      description: "David's Birthday",
      isComplete: false,
    }),
    Event.create({
      eventName: 'Poker Night',
      description: 'Take it to the Town!!!',
      isComplete: false,
    }),
    Event.create({ eventName: 'Brunch', isComplete: false }),
    Event.create({ eventName: 'Drinks', isComplete: false }),
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

  console.log('setting assosiations for user and items');

  let jason = await User.findByPk(3);
  let fries = await Item.findByPk(1);
  let beer = await Item.findByPk(4);

  await jason.setItems([fries, beer]);

  // bug here
  fries.isClaimed = true;
  await (beer.isClaimed = true);

  console.log(`seeded ${events.length} events`);
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
