const graphql = require("graphql")
const { Receipt, User, Event } = require("../server/db")
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
    eventId: { type: GraphQLInt },
    cardDownId: { type: GraphQLInt }
  })
})

//Queries
const receipt = {
  description: "Lists a single receipt by its ID",
  type: ReceiptType,
  args: { id: { type: GraphQLID } },
  resolve(parent, args) {
    return Receipt.findByPk(args.id)
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

// Mutation
const addReceipt = {
  type: ReceiptType,
  args: {
    name: { type: GraphQLString },
    eventId: { type: GraphQLInt }
  },
  async resolve(parent, { name, eventId }) {
    let newReceipt = await Receipt.create({
      name,
      eventId
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

module.exports = {
  receiptQueries: {
    receipt,
    allReceipts
  },
  receiptMutations: {
    addReceipt,
    payReceipt
  },
  ReceiptType
}
