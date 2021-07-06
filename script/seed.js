const db = require("../server/db/db")
const { User, Event, Item } = require("../server/db")

async function seed() {
  await db.sync({ force: true })
  console.log("db synced!")

  const users = await Promise.all([
    User.create({
      username: "alars",
      password: "123",
      firstName: "Andrew",
      lastName: "Larsen"
    }),
    User.create({
      username: "jchen",
      password: "123",
      firstName: "Jason",
      lastName: "Chen"
    }),
    User.create({
      username: "ddege",
      password: "123",
      firstName: "David",
      lastName: "Degenstein"
    }),
    User.create({
      username: "cswit",
      password: "123",
      firstName: "Cody",
      lastName: "Swithenbank"
    })
  ])

  console.log(`seeded ${users.length} users`)

  const events = await Promise.all([
    Event.create({
      eventName: "Dinner",
      description: "David's Birthday",
      isComplete: false
    }),
    Event.create({
      eventName: "Poker Night",
      description: "Take it to the Town!!!",
      isComplete: false
    }),
    Event.create({ eventName: "Brunch", isComplete: false }),
    Event.create({ eventName: "Drinks", isComplete: false })
  ])

  console.log(`seeded ${events.length} events`)

  const items = await Promise.all([
    Item.create({
      name: "French Fries",
      price: 999
    }),
    Item.create({
      name: "Calamari",
      price: 1399
    }),
    Item.create({
      name: "Poke Nachos",
      price: 1699
    }),
    Item.create({
      name: "Stella Artois",
      price: 699
    })
  ])

  console.log(`seeded ${items.length} items`)

  console.log("setting assosiations for user and items")

  let jason = await User.findByPk(3)
  let fries = await Item.findByPk(1)
  let beer = await Item.findByPk(4)
  let dinner = await Event.findByPk(1)

  await jason.setItems([fries, beer])

  await fries.update({ isClaimed: true })
  await beer.update({ isClaimed: true })

  await jason.addEvent([dinner])

  console.log(`seeded successfully`)
}

async function runSeed() {
  console.log("seeding...")
  try {
    await seed()
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  } finally {
    console.log("closing db connection")
    await db.close()
    console.log("db connection closed")
  }
}

if (module === require.main) {
  runSeed()
}

module.exports = seed
