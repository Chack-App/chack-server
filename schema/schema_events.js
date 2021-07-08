const graphql = require("graphql")
const { Event, User } = require("../server/db")
// const { UserSchema } = require("./schema_users")
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList
} = graphql

const EventType = new GraphQLObjectType({
  name: "Event",
  description: "This represents Events",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    eventName: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    passcode: { type: GraphQLString },
    isComplete: { type: GraphQLNonNull(GraphQLBoolean) }
    // users: { type: GraphQLList(UserSchema) }
    // In the future we should figure out how to setup a createdAt (Date) and
    // completedAt (Date) field so we can query events by dates
  })
})

//Queries
const event = {
  description: "Lists a single event by its ID",
  type: EventType,
  args: { id: { type: GraphQLID } },
  resolve(parent, args) {
    return Event.findByPk(args.id)
  }
}

const allEvents = {
  description: "Lists all events",
  type: new GraphQLList(EventType),
  resolve: () => Event.findAll()
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
    });
    let currentUser = await User.findByPk(1);
    await currentUser.addEvent(newEvent);
    return newEvent;
  }
};

const joinEvent = {
  type: EventType,
  args: {
    passcode: { type: GraphQLString },
  },
  async resolve(parent, { passcode }) {
    const event = await Event.findOne({
      where: {
        passcode
      }
    })
    const user = await User.findByPk(1);
    await user.addEvent(event)
    return event;
  }

}

module.exports = {
  eventQueries: {
    event,
    allEvents
  },
  eventMutations: {
    addEvent,
    joinEvent
  },
  EventType
}
