const db = require("../server/db/db")
const { User, Event, Item, Receipt } = require("../server/db")

async function seed() {
  await db.sync({ force: true })
  console.log("db synced!")

  const users = await Promise.all([
    User.create({
      email: "alars@example.com",
      password: "123",
      firstName: "Andrew",
      lastName: "Larsen"
    }),
    User.create({
      email: "jchen@example.com",
      password: "123",
      firstName: "Jason",
      lastName: "Chen"
    }),
    User.create({
      email: "ddege@example.com",
      password: "123",
      firstName: "David",
      lastName: "Degenstein"
    }),
    User.create({
      email: "cswit@example.com",
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
      isComplete: true
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

  const receipts = await Promise.all([
    Receipt.create({
      name: "Dinner",
      isPaid: false
    }),
    Receipt.create({
      name: "Drinks",
      isPaid: false
    })
  ])
  console.log(`seeded ${receipts.length} receipts`)

  console.log("setting assosiations")

  let jason = users[1]
  let cody = users[3]
  let david = users[2]
  let fries = items[0]
  let calamari = items[1]
  let poke = items[2]
  let beer = items[3]
  let dinner = events[0]
  let drinks = events[3]
  let dinnerReceipt = receipts[0]
  let drinksReceipt = receipts[1]

  await jason.setItems([fries, beer, calamari])
  await cody.setItems([poke])

  await fries.update({ isClaimed: true })
  await beer.update({ isClaimed: true })
  await calamari.update({ isClaimed: true })
  await poke.update({ isClaimed: true })

  await jason.addEvents([dinner, drinks])
  await david.addEvent([dinner])
  await cody.addEvent([drinks])

  await dinnerReceipt.setEvent(dinner)
  await drinksReceipt.setEvent(drinks)

  await fries.setReceipt(dinnerReceipt)
  await calamari.setReceipt(dinnerReceipt)
  await beer.setReceipt(drinksReceipt)
  await poke.setReceipt(drinksReceipt)

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
