const graphql = require("graphql");
const { User } = require("../server/db");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const UserSchema = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
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

module.exports = {
  userQueries: {
    user,
  },
  UserSchema,
};
