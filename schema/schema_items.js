const graphql = require("graphql")
const { Item, Receipt, User } = require("../server/db/")
const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull
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

// toggle isClaimed state
const claimItem = {
  type: ItemSchema,
  args: {
    itemId: { type: GraphQLID },
    userId: { type: GraphQLID }
  },
  async resolve(parent, args) {
    let claimedItem = await Item.findByPk(args.itemId)
    let user = await User.findByPk(args.userId)
    let itemUser = await claimedItem.getUsers()
    if (claimedItem.isClaimed) {
      if (user.id === itemUser[0].id) {
        claimedItem.isClaimed = false
        claimedItem.removeUser(user)
      }
    } else {
      claimedItem.isClaimed = true
      claimedItem.addUser(user)
    }
    claimedItem.save()

    return claimedItem
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

const updateItem = {
  type: ItemSchema,
  args: {
    id: { type: GraphQLID },
    name: { type: GraphQLNonNull(GraphQLString) },
    price: { type: GraphQLNonNull(GraphQLInt) }
  },
  async resolve(parent, args) {
    const currentItem = await Item.findByPk(args.id)
    currentItem.name = args.name
    currentItem.price = args.price
    await currentItem.save()
    return currentItem
  }
}

const addOrUpdateItems = {
  type: new GraphQLList(ItemSchema),
  args: {
    items: { type: GraphQLList(ItemInput) },
    receiptId: { type: GraphQLID }
  },
  async resolve(parent, { items, receiptId }) {
    let newItemArr = []
    console.log("original item arr -->", items)
    const currentReceipt = await Receipt.findByPk(receiptId)
    for (let i = 0; i < items.length; i++) {
      console.log("enter for loop")
      console.log(items[i], items[i].id, items[i].id === undefined)
      if (items[i].id) {
        const itemToUpdate = await Item.findByPk(items[i].id)
        console.log("updating", itemToUpdate.name)
        const updatedItem = await itemToUpdate.update({
          name: items[i].name,
          price: items[i].price
        })
        newItemArr.push(updatedItem)
      } else {
        console.log("creating item -->", items[i].name)
        const itemToAdd = await Item.create(items[i])
        await itemToAdd.setReceipt(currentReceipt)
        newItemArr.push(itemToAdd)
      }
    }
    console.log("New Item Arr -->", newItemArr)
    return newItemArr
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
    claimItem,
    removeItem,
    addOrUpdateItems
  },
  ItemSchema
}
