const graphql = require("graphql")
const { User, Event } = require("../server/db")
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} = graphql

let { EventType } = require("./schema_events")

const UserSchema = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    payPalMe: { type: GraphQLString }
  })
})

const AuthType = new GraphQLObjectType({
  name: "Authentication",
  fields: () => ({
    token: { type: GraphQLString },
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    payPalMe: { type: GraphQLString }
  })
})

//Query
const user = {
  type: UserSchema,
  args: { id: { type: GraphQLID } },
  resolve(parent, args, context) {
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

    return userEventArr.events
  }
}

const activeUserEvents = {
  type: new GraphQLList(EventType),
  args: { id: { type: GraphQLID } },
  async resolve(parent, args) {
    let activeUserEvents = await User.findOne({
      where: {
        id: args.id
      },
      include: [
        {
          model: Event,
          required: false,
          where: {
            isComplete: false
          }
        }
      ]
    })
    return activeUserEvents.events
  }
}

const pastUserEvents = {
  type: new GraphQLList(EventType),
  args: { id: { type: GraphQLID } },
  async resolve(parent, args) {
    let activeUserEvents = await User.findOne({
      where: {
        id: args.id
      },
      include: [
        {
          model: Event,
          where: {
            isComplete: true
          }
        }
      ]
    })
    return activeUserEvents.events
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
    const { email, firstName, lastName, payPalMe, id } = await User.findOne({
      where: {
        email: args.email
      }
    })
    return { token, email, firstName, lastName, payPalMe, id }
  }
}

const signup = {
  type: AuthType,
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    payPalMe: { type: GraphQLString }
  },
  async resolve(parent, args) {
    const user = await User.findOne({
      where: { email: args.email }
    })

    if (user) {
      throw new Error("This user already exists")
    }
    const { email, firstName, lastName, payPalMe, id } = await User.create({
      email: args.email,
      password: args.password,
      firstName: args.firstName,
      lastName: args.lastName,
      payPalMe: args.payPalMe
    })
    const token = await User.authenticate({
      email: args.email,
      password: args.password
    })
    return { token, email, firstName, lastName, payPalMe, id }
  }
}

const updateUser = {
  type: AuthType,
  args: {
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    payPalMe: { type: GraphQLString }
  },
  async resolve(parent, args) {
    const user = await User.findOne({
      where: { email: args.email }
    })
    user.firstName = args.firstName
    user.lastName = args.lastName
    user.payPalMe = args.payPalMe
    await user.save()
    return user
  }
}

module.exports = {
  userQueries: {
    user,
    userEvents,
    activeUserEvents,
    pastUserEvents
  },
  userMutations: {
    login,
    signup,
    updateUser
  },
  UserSchema
}
