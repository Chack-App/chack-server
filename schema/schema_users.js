const graphql = require("graphql")
const { Event } = require("../server/db")
const { User } = require("../server/db")
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql
let { EventType } = require("./schema_events")

const UserSchema = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString }
  })
})

//Query
const user = {
  type: UserSchema,
  args: { id: { type: GraphQLID } },
  resolve(parent, args) {
    return User.findByPk(args.id)
  }
}

const userEvents = {
  type: new GraphQLList(EventType),
  args: { id: { type: GraphQLID } },
  async resolve(parent, args) {
    let userEventArr = await User.findOne({
      where: {
        id: args.id
      },
      include: [
        {
          model: Event
          // include: [User]
        }
      ]
    })

    console.log(userEventArr.events)
    return userEventArr.events
  }
}

module.exports = {
  userQueries: {
    user,
    userEvents
  },
  UserSchema
}
