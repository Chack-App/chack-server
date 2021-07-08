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

const AuthType = new GraphQLObjectType({
  name: "Authentication",
  fields: () => ({
    token: { type: GraphQLString },
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString }
  })
})

//Query
const user = {
  type: UserSchema,
  // args: { id: { type: GraphQLID } },
  resolve(parent, args, context) {
    return User.findByToken(context.authorization)
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

    // console.log(userEventArr.events)
    return userEventArr.events
  }
}

// Mutation
const login = {
  type: AuthType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  },
  async resolve(parent, args) {
    const token = await User.authenticate({
      email: args.email,
      password: args.password
    })
    const { email, firstName, lastName, id } = await User.findOne({
      where: {
        email: args.email
      }
    })
    return { token, email, firstName, lastName, id }
  }
}

const signup = {
  type: AuthType,
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString }
  },
  async resolve(parent, args) {
    const user = await User.findOne({
      where: { email: args.email }
    })

    if (user) {
      throw new Error("This user already exists")
    }
    await User.create({
      email: args.email,
      password: args.password
    })
    const token = await User.authenticate({
      email: args.email,
      password: args.password
    })
    return { token }
  }
}

module.exports = {
  userQueries: {
    user,
    userEvents
  },
  userMutations: {
    login,
    signup
  },
  UserSchema
}
