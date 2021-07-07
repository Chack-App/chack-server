const graphql = require("graphql")
const { User, Event } = require("../server/db")
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean
} = graphql

let { EventType } = require("./schema_events")

const UserSchema = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
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

// Mutation
const login = {
  type: UserSchema,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  },
  async resolve(parent, args, request) {
    const user = await User.findOne({ where: { email: args.email } })
    const validate = await user.correctPassword(args.password)

    if (!user) {
      throw new Error(
        `Could not find account associated with email: ${args.email}`
      )
    } else if (!validate) {
      console.log("here")
      throw new Error(
        `Incorrect password for account associated with: ${args.email}`
      )
    } else {
      const setUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
      request.login(setUser, error => (error ? error : setUser))
      console.log(request.user)
      return user
    }
  }
}

module.exports = {
  userQueries: {
    user,
    userEvents
  },
  userMutations: {
    login
  },
  UserSchema
}
