const graphql = require("graphql")
const { Event } = require("../server/db")
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

module.exports = {
  eventQueries: {
    event,
    allEvents
  },
  EventType
}
