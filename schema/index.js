const graphql = require("graphql");

const { userQueries } = require("./schema_users");

const { GraphQLObjectType, GraphQLSchema } = graphql;

const MasterQuery = new GraphQLObjectType({
  name: "MasterQuerySchema",
  fields: {
    ...userQueries,
  },
});

module.exports = new GraphQLSchema({
  query: MasterQuery,
});
