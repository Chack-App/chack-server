const graphql = require("graphql")

const { userQueries, userMutations } = require("./schema_users")
const { itemQueries, itemMutations } = require("./schema_items")
const { eventQueries, eventMutations } = require("./schema_events")
// const { userEventQueries } = require("./schema_user_events")

const { GraphQLObjectType, GraphQLSchema } = graphql

const MasterQuery = new GraphQLObjectType({
  name: "MasterQuerySchema",
  description: "This is encompases all Queries",
  fields: {
    ...userQueries,
    ...itemQueries,
    ...eventQueries
    // ...userEventQueries
  }
})

const MasterMutation = new GraphQLObjectType({
  name: "MasterMutationSchema",
  fields: {
    ...itemMutations,
    ...userMutations,
    ...eventMutations
  }
})

module.exports = new GraphQLSchema({
  query: MasterQuery,
  mutation: MasterMutation
})
