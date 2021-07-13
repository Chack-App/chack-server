const graphql = require("graphql")
const { Item, Receipt, User } = require("../server/db/")
const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} = graphql

// Item Type

const ItemSchema = new GraphQLObjectType({
  name: "Item",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: GraphQLInt },
    isClaimed: { type: GraphQLBoolean },
    splitBetween: { type: GraphQLInt },
    receiptId: { type: GraphQLInt },
    users: { type: GraphQLList(ItemUserSchema) }
  })
})

const ItemUserSchema = new GraphQLObjectType({
  name: "ItemUser",
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString }
  })
})

// Input Type (Used for passing array into mutation)

const ItemInput = new GraphQLInputObjectType({
  name: "ItemInput",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: GraphQLInt },
    isClaimed: { type: GraphQLBoolean },
    splitBetween: { type: GraphQLInt },
    receiptId: { type: GraphQLInt }
  })
})

// Query

const items = {
  type: new GraphQLList(ItemSchema),
  resolve() {
    return Item.findAll()
  }
}

const item = {
  type: ItemSchema,
  args: { id: { type: GraphQLID } },
  resolve(parent, args) {
    return Item.findByPk(args.id)
  }
}

// Mutation
const addItems = {
  type: new GraphQLList(ItemSchema),
  args: {
    items: { type: GraphQLList(ItemInput) },
    receiptId: { type: GraphQLID }
  },
  async resolve(parent, { items, receiptId }) {
    let addedItems = []
    const currentReceipt = await Receipt.findByPk(receiptId)
    for (let i = 0; i < items.length; i++) {
      let item = await Item.create({
        name: items[i].name,
        price: items[i].price
      })
      await item.setReceipt(currentReceipt)
      addedItems.push(item)
    }
    return addedItems
  }
}

const addItem = {
  type: ItemSchema,
  args: {
    name: { type: GraphQLString },
    price: { type: GraphQLInt }
  },
  async resolve(parent, args) {
    let addedItem = await Item.create({
      name: args.name,
      price: args.price
    })
    return addedItem
  }
}

const claimItems = {
  type: ItemSchema,
  args: {
    itemArray: { type: GraphQLList(ItemInput) },
    userId: { type: GraphQLID}
  },
  async resolve(parent, args) {
   await args.itemArray.forEact(item =>{
      let claimedItem = Item.findByPk(item.id)
      claimedItem.isClaimed = true
      
      let user = User.findByPk(args.userId)
      claimedItem.setUser(user)
      
      claimedItem.save()
    })
    //console.log(claimedItem)
    return args.itemArray
  }
}

const removeItem = {
  type: ItemSchema,
  args: {
    id: { type: GraphQLID }
  },
  async resolve(parent, args) {
    let removedItem = await Item.findByPk(args.id)
    removedItem.destroy()
  }
}

module.exports = {
  itemQueries: {
    item,
    items
  },
  itemMutations: {
    addItem,
    addItems,
    claimItems,
    removeItem
  },
  ItemSchema
}
