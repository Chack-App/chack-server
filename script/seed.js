const { db } = require("../server/db/db");
const { User } = require("../server/db");
const { Event } = require("../server/db");

async function seed() {
  await db.sync({ force: true });
  console.log("db synced!");

  const users = await Promise.all([
    User.create({ username: "andrew", password: "123" }),
    User.create({ username: "jason", password: "123" }),
    User.create({ username: "david", password: "123" }),
    User.create({ username: "cody", password: "123" }),
  ]);

  const events = await Promise.all([
    Event.create({ eventName: "Dinner", description: "David's Birthday", isComplete: false}),
    Event.create({ eventName: "Poker Night", description: "Take it to the Town!!!", isComplete: false}),
    Event.create({ eventName: "Brunch", isComplete: false}),
    Event.create({ eventName: "Drinks", isComplete: false}),
  ]);

  console.log(`seeded ${users.length} users`);
  console.log(`seeded ${events.length} events`);
  console.log(`seeded successfully`);
}

async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
  }
}

if (module === require.main) {
  runSeed();
}

module.exports = seed;
