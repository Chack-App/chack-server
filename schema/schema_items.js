const graphql = require('graphql');
const { Item } = require('../server/db/models');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const ItemSchema = new GraphQLObjectType({
  name: 'Item',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: graphql.GraphQLInt },
    isClaimed: { type: graphql.GraphQLBoolean },
    splitBetween: { type: graphql.GraphQLInt },
    receiptId: { type: graphql.GraphQLInt },
  }),
});

// Query

const item = {
  type: ItemSchema,
  args: { id: { type: GraphQLID } },
  resolve(parent, args) {
    return Item.findByPk(args.id);
  },
};

module.exports = {
  itemQueries: {
    item,
  },
  ItemSchema,
};
