const graphql = require('graphql');

const { userQueries } = require('./schema_users');
const { itemQueries, itemMutations } = require('./schema_items');

const { GraphQLObjectType, GraphQLSchema } = graphql;

const MasterQuery = new GraphQLObjectType({
  name: 'MasterQuerySchema',
  fields: {
    ...userQueries,
    ...itemQueries,
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
