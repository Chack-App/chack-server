const graphql = require("graphql");

const { userQueries } = require("./schema_users");
const { eventQueries }  = require("./schema_events")

const { GraphQLObjectType, GraphQLSchema } = graphql;

const MasterQuery = new GraphQLObjectType({
  name: "MasterQuerySchema",
  description: 'This is encompases all Queries',
  fields: () => ({
    ...userQueries,
    ...eventQueries
  }
)});

module.exports = new GraphQLSchema({
  query: MasterQuery,
});
