const graphql = require("graphql")
const { Event, User, Receipt } = require("../server/db")

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList
} = graphql
const { ReceiptType } = require("./schema_receipts")

const EventsUserSchema = new GraphQLObjectType({
  name: "EventUser",
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString }
  })
})

const EventType = new GraphQLObjectType({
  name: "Event",
  description: "This represents Events",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    eventName: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    passcode: { type: GraphQLString },
    isComplete: { type: GraphQLNonNull(GraphQLBoolean) },
    receipts: { type: GraphQLList(ReceiptType) },
    users: { type: GraphQLList(EventsUserSchema) }
    // In the future we should figure out how to setup a createdAt (Date) and
    // completedAt (Date) field so we can query events by dates
  })
})

//Queries
const event = {
  description: "Lists a single event by its ID",
  type: EventType,
  args: { id: { type: GraphQLID } },
  async resolve(parent, args) {
    const event = await Event.findByPk(args.id, {
      include: [
        {
          model: Receipt
        },
        {
          model: User
        }
      ]
    })
    console.log(event)
    return event
  }
}

const allEvents = {
  description: "Lists all events",
  type: new GraphQLList(EventType),
  resolve: () => Event.findAll()
}

const activeEventReceipts = {
  type: new GraphQLList(ReceiptType),
  args: { id: { type: GraphQLID } },
  async resolve(parent, args) {
    let activeEventReceipts = await Event.findOne({
      where: {
        id: args.id
      },
      include: [
        {
          model: Receipt,
          where: {
            isPaid: false
          }
        }
      ]
    })
    return activeEventReceipts.receipts
  }
}

const pastEventReceipts = {
  type: new GraphQLList(ReceiptType),
  args: { id: { type: GraphQLID } },
  async resolve(parent, args) {
    let pastEventReceipts = await Event.findOne({
      where: {
        id: args.id
      },
      include: [
        {
          model: Receipt,
          where: {
            isPaid: true
          }
        }
      ]
    })
    return pastEventReceipts.receipts
  }
}

// Mutation
const addEvent = {
  type: EventType,
  args: {
    eventName: { type: GraphQLString },
    description: { type: GraphQLString }
  },
  async resolve(parent, { eventName, description }) {
    let newEvent = await Event.create({
      eventName,
      description
    })
    let currentUser = await User.findByPk(1)
    await currentUser.addEvent(newEvent)
    return newEvent
  }
}

const joinEvent = {
  type: EventType,
  args: {
    passcode: { type: GraphQLString }
  },
  async resolve(parent, { passcode }) {
    const event = await Event.findOne({
      where: {
        passcode
      }
    })
    const user = await User.findByPk(1)
    await user.addEvent(event)
    return event
  }
}

module.exports = {
  eventQueries: {
    event,
    allEvents,
    activeEventReceipts,
    pastEventReceipts
  },
  eventMutations: {
    addEvent,
    joinEvent
  },
  EventType
}
