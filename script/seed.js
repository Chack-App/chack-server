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
      lastName: "Larsen",
      payPalMe: "AndrewLarsen"
    }),
    User.create({
      email: "jchen@example.com",
      password: "123",
      firstName: "Jason",
      lastName: "Chen",
      payPalMe: "JasonChen"
    }),
    User.create({
      email: "ddege@example.com",
      password: "123",
      firstName: "David",
      lastName: "Degenstein",
      payPalMe: "DavidDegenstein"
    }),
    User.create({
      email: "cswit@example.com",
      password: "123",
      firstName: "Cody",
      lastName: "Swithenbank",
      payPalMe: "CodySwithenbank"
    })
  ])

  console.log(`seeded ${users.length} users`)

  const events = await Promise.all([
    Event.create({
      eventName: "Boys Night Out",
      description: "David's Birthday",
      isComplete: false
    }),
    Event.create({
      eventName: "Poker Night",
      description: "Take it to the Town!!!",
      isComplete: true
    }),
    Event.create({ eventName: "Brunch", isComplete: false }),
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
    }),
    Item.create({
      name: "David's Buy In",
      price: 7500
    }),
    Item.create({
      name: "Cody's Buy In",
      price: 10000
    }),
    Item.create({
      name: "Jason's Buy In",
      price: 15000
    }),
    Item.create({
      name: "Andrew's Buy In",
      price: 5000
    }),
    Item.create({
      name: "David's Ticket",
      price: 1100,
    }),
    Item.create({
      name: "Cody's Ticket",
      price: 1100,
    }),
    Item.create({
      name: "Jason's Ticket",
      price: 1100,
    }),
    Item.create({
      name: "Andrew's Ticket",
      price: 1100,
    
    }),
    Item.create({
      name: "Popcorn",
      price: 800,
    }),
    Item.create({
      name: "Candy",
      price: 400,
    }),
    Item.create({
      name: "Soda",
      price: 600,
    })
  ])

  console.log(`seeded ${items.length} items`)

  const receipts = await Promise.all([
    Receipt.create({
      name: "Dinner",
      isPaid: false,
      cardDownId: 4,
    }),
    Receipt.create({
      name: "Drinks",
      isPaid: false,
      cardDownId: 2,
    }),
    Receipt.create({
      name: "Going to the Movies",
      isPaid: false,
      cardDownId: 3
    }),
    Receipt.create({
      name: "Buy Ins",
      isPaid: true,
      isApproved: true,
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

  let davidBuyIn = items[12]
  let codyBuyIn = items[13]
  let jasonBuyIn = items[14]
  let andrewBuyIn = items[15]

  let davidMovieTicket = items[16]
  let codyMovieTicket = items[17]
  let jasonMovieTicket = items[18]
  let andrewMovieTicket = items[19]
  let popcorn = items[20]
  let candy = items[21]
  let soda = items[22]

  let boysNightOut = events[0]
  let pokerNight = events[1]

  let dinnerReceipt = receipts[0]
  let drinksReceipt = receipts[1]
  let movieReceipt = receipts[2]
  let buyInsReceipt = receipts[3]

  //drinks event is to demonstrate event ready to be closed
  //dinner event is to demonstrate event that needs settling
  //poker night event is to demonstrate past events
  await jason.addEvents([boysNightOut, pokerNight])
  await david.addEvent([boysNightOut, pokerNight])
  await andrew.addEvent([boysNightOut, pokerNight])
  await cody.addEvent([boysNightOut, pokerNight])

  await dinnerReceipt.setEvent(boysNightOut)
  await drinksReceipt.setEvent(boysNightOut)
  await movieReceipt.setEvent(boysNightOut)
  await buyInsReceipt.setEvent(pokerNight)

  // for dinner receipt
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
  await blueMoon.setReceipt(drinksReceipt)
  await stella.setReceipt(drinksReceipt)


  //for movie receipt

  await davidMovieTicket.setReceipt(movieReceipt)
  await codyMovieTicket.setReceipt(movieReceipt)
  await jasonMovieTicket.setReceipt(movieReceipt)
  await andrewMovieTicket.setReceipt(movieReceipt)
  await popcorn.setReceipt(movieReceipt)
  await candy.setReceipt(movieReceipt)
  await soda.setReceipt(movieReceipt)


  // for poker night receipt
  await jason.setItems(jasonBuyIn)
  await jasonBuyIn.update({ isClaimed: true })
  await david.setItems(davidBuyIn)
  await davidBuyIn.update({ isClaimed: true })
  await cody.setItems(codyBuyIn)
  await codyBuyIn.update({ isClaimed: true })
  await andrew.setItems(andrewBuyIn)
  await andrewBuyIn.update({ isClaimed: true })

  await davidBuyIn.setReceipt(buyInsReceipt)
  await codyBuyIn.setReceipt(buyInsReceipt)
  await jasonBuyIn.setReceipt(buyInsReceipt)
  await andrewBuyIn.setReceipt(buyInsReceipt)

  // update cardDownID dinner user
  await dinnerReceipt.update({ cardDownId: david.id })
  await dinnerReceipt.update({ cardDownHandle: david.payPalMe })
  await drinksReceipt.update({ cardDownId: david.id })
  await drinksReceipt.update({ cardDownHandle: david.payPalMe })
  await buyInsReceipt.update({ cardDownId: david.id })
  await buyInsReceipt.update({ cardDownHandle: david.payPalMe })
  await movieReceipt.update({ cardDownId: david.id })
  await movieReceipt.update({ cardDownHandle: david.payPalMe })

  

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
