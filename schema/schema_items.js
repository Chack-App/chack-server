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

const items = {
  type: new GraphQLList(ItemSchema),
  resolve() {
    return Item.findAll();
  },
};

const item = {
  type: ItemSchema,
  args: { id: { type: GraphQLID } },
  resolve(parent, args) {
    return Item.findByPk(args.id);
  },
};

// Mutation
const addItem = {
  type: ItemSchema,
  args: {
    name: { type: graphql.GraphQLString },
    price: { type: graphql.GraphQLInt },
  },
  async resolve(parent, args, context) {
    let addedItem = await Item.create({
      name: args.name,
      price: args.price,
    });
    return addedItem;
  },
};

const claimItem = {
  type: ItemSchema,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, args) {
    let claimedItem = await Item.findByPk(args.id);
    console.log(claimedItem);
    claimedItem.isClaimed = true;
    claimedItem.save();
    return claimedItem;
  },
};

module.exports = {
  itemQueries: {
    item,
    items,
  },
  itemMutations: {
    addItem,
    claimItem,
  },
  ItemSchema,
};
