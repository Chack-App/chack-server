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
    username: { type: GraphQLString },
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
  type: GraphQLBoolean,
  args: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, request) {
    const user = await User.findOne({ where: { username: args.username } });
    const validate = await user.correctPassword(args.password);

    if (!user) {
      throw new Error(
        `Could not find account associated with username: ${args.username}`
      );
    } else if (!validate) {
      console.log("here");
      throw new Error(
        `Incorrect password for account associated with: ${args.username}`
      );
    } else {
      request.login(user, (error) => (error ? error : user));
      return true;
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
