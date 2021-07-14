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
    }),
    Item.create({
      name: "Steak",
      price: 3999
    }),
    Item.create({
      name: "Penne alla Vodka",
      price: 2399
    }),
    Item.create({
      name: "Tuna Roll",
      price: 899
    }),
    Item.create({
      name: "Blue Moon",
      price: 699
    }),
    Item.create({
      name: "Onion Rings",
      price: 999
    }),
    Item.create({
      name: "Pepperoni Slice",
      price: 699
    }),
    Item.create({
      name: "Fried Rice",
      price: 1699
    }),
    Item.create({
      name: "Pork Buns",
      price: 699
    })
  ])

  console.log(`seeded ${items.length} items`)

  const receipts = await Promise.all([
    Receipt.create({
      name: "Dinner",
      isPaid: false,
      cardDownId: 4,
      cardDownHandle: "JasonChen"
    }),
    Receipt.create({
      name: "Drinks",
      isPaid: false,
      cardDownId: 2
    })
  ])
  console.log(`seeded ${receipts.length} receipts`)

  console.log("setting assosiations")

  let andrew = users[0]
  let jason = users[1]
  let cody = users[3]
  let david = users[2]

  let fries = items[0]
  let calamari = items[1]

  let pokeNachos = items[2]
  let stella = items[3]
  let steak = items[4]
  let penne = items[5]
  let tunaRoll = items[6]
  let blueMoon = items[7]
  let onionRings = items[8]
  let pepperoni = items[9]
  let friedRice = items[10]
  let porkBuns = items[11]

  let dinner = events[0]
  let drinks = events[3]

  let dinnerReceipt = receipts[0]
  let drinksReceipt = receipts[1]

  //drinks event is to demonstrate event ready to be closed
  //dinner event is to demonstrate event that needs settling
  await jason.addEvents([dinner, drinks])
  await david.addEvent([dinner])
  await andrew.addEvent([dinner])
  await cody.addEvent([dinner])

  await dinnerReceipt.setEvent(dinner)
  await drinksReceipt.setEvent(drinks)

  await fries.setReceipt(dinnerReceipt)
  await calamari.setReceipt(dinnerReceipt)

  await pokeNachos.setReceipt(dinnerReceipt)
  await steak.setReceipt(dinnerReceipt)
  await penne.setReceipt(dinnerReceipt)
  await tunaRoll.setReceipt(dinnerReceipt)
  await onionRings.setReceipt(dinnerReceipt)
  await pepperoni.setReceipt(dinnerReceipt)
  await friedRice.setReceipt(dinnerReceipt)
  await porkBuns.setReceipt(dinnerReceipt)

  //for drinks receipt
  await jason.setItems([stella, blueMoon])
  await stella.update({ isClaimed: true })
  await blueMoon.update({ isClaimed: true })

  await blueMoon.setReceipt(drinksReceipt)
  await stella.setReceipt(drinksReceipt)

  // update cardDownID dinner user
  await dinnerReceipt.update({ cardDownId: jason.id })
  await drinksReceipt.update({ cardDownId: jason.id })

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
