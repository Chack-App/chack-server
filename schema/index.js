const graphql = require('graphql');

const { userQueries } = require('./schema_users');
const { itemQueries } = require('./schema_items');

const { GraphQLObjectType, GraphQLSchema } = graphql;

const MasterQuery = new GraphQLObjectType({
  name: 'MasterQuerySchema',
  fields: {
    ...userQueries,
    ...itemQueries,
  },
});

module.exports = new GraphQLSchema({
  query: MasterQuery,
});
