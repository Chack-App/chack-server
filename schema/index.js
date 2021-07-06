const graphql = require('graphql');

const { userQueries } = require('./schema_users');
const { itemQueries, itemMutations } = require('./schema_items');
const { eventQueries }  = require("./schema_events")

const { GraphQLObjectType, GraphQLSchema } = graphql;

const MasterQuery = new GraphQLObjectType({
  name: 'MasterQuerySchema',
  description: 'This is encompases all Queries',
  fields: {
    ...userQueries,
    ...itemQueries,
    ...eventQueries
  },
});

const MasterMutation = new GraphQLObjectType({
  name: 'MasterMutationSchema',
  fields: {
    ...itemMutations,
  },
});

module.exports = new GraphQLSchema({
  query: MasterQuery,
  mutation: MasterMutation,
});
