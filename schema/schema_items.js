const graphql = require('graphql');
const { Item } = require('../server/db/models');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
} = graphql;

const ItemSchema = new GraphQLObjectType({
  name: 'Item',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: GraphQLInt },
    isClaimed: { type: GraphQLBoolean },
    splitBetween: { type: GraphQLInt },
    receiptId: { type: GraphQLInt },
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
    name: { type: GraphQLString },
    price: { type: GraphQLInt },
  },
  async resolve(parent, args) {
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

const removeItem = {
  type: ItemSchema,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, args) {
    let removedItem = await Item.findByPk(args.id);
    removedItem.destroy();
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
    removeItem,
  },
  ItemSchema,
};
