const graphql = require("graphql")
const { Receipt, Event, Item, User } = require("../server/db")
const { ItemSchema } = require("./schema_items")
// const { UserSchema } = require("./schema_users")
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList
} = graphql

const ReceiptType = new GraphQLObjectType({
  name: "Receipt",
  description: "This represents Receipts",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    isPaid: { type: GraphQLNonNull(GraphQLBoolean) },
    isApproved: { type: GraphQLNonNull(GraphQLBoolean) },
    eventId: { type: GraphQLInt },
    cardDownId: { type: GraphQLInt },
    cardDownPersonPayPalMe: { type: GraphQLString },
    items: { type: GraphQLList(ItemSchema) }
  })
})

//Queries
const receipt = {
  description: "Lists a single receipt by its ID",
  type: ReceiptType,
  args: { id: { type: GraphQLID } },
  async resolve(parent, args) {
    const data = await Receipt.findByPk(args.id, {
      include: [
        {
          model: Item,
          include: [User]
        }
      ]
    })
    //await console.log(data.items[0].dataValues.users)
    return data
  }
}

const allReceipts = {
  description: "Lists all receipts",
  type: new GraphQLList(ReceiptType),
  args: { eventId: { type: GraphQLInt } },
  async resolve(parent, args) {
    let receipts = await Receipt.findAll({
      where: {
        eventId: args.eventId
      }
    })
    return receipts
  }
}

const allActiveReceipts = {
  description: "Lists all active receipts",
  type: new GraphQLList(ReceiptType),
  args: { eventId: { type: GraphQLInt } },
  async resolve(parent, args) {
    let receipts = await Receipt.findAll({
      where: {
        eventId: args.eventId,
        isPaid: false
      }
    })
    return receipts
  }
}

const allPastReceipts = {
  description: "Lists all past receipts",
  type: new GraphQLList(ReceiptType),
  args: { eventId: { type: GraphQLInt } },
  async resolve(parent, args) {
    // **** Keep in mind .findOne only gives you one instance, not all of them
    let receipts = await Receipt.findOne({
      where: {
        eventId: args.eventId,
        isPaid: true
      }
    })
    return receipts
  }
}

// Mutation
const addReceipt = {
  type: ReceiptType,
  args: {
    name: { type: GraphQLString },
    eventId: { type: GraphQLInt },
    cardDownId: { type: GraphQLInt }
  },
  async resolve(parent, { name, eventId, cardDownId }) {
    let newReceipt = await Receipt.create({
      name,
      eventId,
      cardDownId
    })
    let currentEvent = await Event.findByPk(eventId)
    await currentEvent.addReceipt(newReceipt)
    return newReceipt
  }
}

const payReceipt = {
  type: ReceiptType,
  args: {
    id: { type: GraphQLID }
  },
  async resolve(parent, { id }) {
    let updatedReceipt = await Receipt.findByPk(id)
    if (updatedReceipt.isPaid === true) {
      throw new Error("You cannot update a completed receipt")
    } else {
      updatedReceipt.isPaid = true
    }
    updatedReceipt.save()
    return updatedReceipt
  }
}

const setApproved = {
  type: ReceiptType,
  args: {
    id: { type: GraphQLID }
  },
  async resolve(parent, args) {
    let receipt = await Receipt.findByPk(args.id)
    receipt.isApproved = true
    receipt.save()
    return receipt
  }
}

module.exports = {
  receiptQueries: {
    receipt,
    allReceipts,
    allActiveReceipts,
    allPastReceipts
  },
  receiptMutations: {
    addReceipt,
    payReceipt,
    setApproved
  },
  ReceiptType
}
