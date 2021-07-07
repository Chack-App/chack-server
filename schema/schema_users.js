const graphql = require("graphql");
const { User } = require("../server/db");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = graphql;

const UserSchema = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
  }),
});

//Query
const user = {
  type: UserSchema,
  args: { id: { type: GraphQLID } },
  resolve(parent, args) {
    return User.findByPk(args.id);
  },
};

// Mutation
const login = {
  type: UserSchema,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, request) {
    const user = await User.findOne({ where: { email: args.email } });
    const validate = await user.correctPassword(args.password);

    if (!user) {
      throw new Error(
        `Could not find account associated with email: ${args.email}`
      );
    } else if (!validate) {
      console.log("here");
      throw new Error(
        `Incorrect password for account associated with: ${args.email}`
      );
    } else {
      request.login(user, (error) => (error ? error : user));
      return user;
    }
  },
};

module.exports = {
  userQueries: {
    user,
  },
  userMutations: {
    login,
  },
  UserSchema,
};
