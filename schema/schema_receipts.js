const graphql = require("graphql")
const { Receipt, User } = require("../server/db")
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
    receiptName: { type: GraphQLNonNull(GraphQLString) },
    isActive: { type: GraphQLNonNull(GraphQLBoolean) },
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
  async resolve(parent, { eventId }) {
   let receipts = await Receipt.findAll({
     where: { eventId: eventId }
    })
    return receipts
  }
}

// Mutation
const addReceipt = {
  type: ReceiptType,
  args: {
    receiptName: { type: GraphQLString },
    isActive: { type: GraphQLBoolean }
  },
  async resolve(parent, { receiptName, isActive }) {
    let newReceipt = await Receipt.create({
      receiptName,
      isActive
    });
    let currentReceipt = await Event.findByPk(1);
    await currentReceipt.addEvent(newReceipt);
    return newReceipt;
  }
};

const completeReceipt = {
  type: ReceiptType,
  args: {
    receiptId: { type: GraphQLID },
    receiptName: { type: GraphQLString },
    isActive: { type: GraphQLBoolean }  
  },
  async resolve(parent, { receiptId }){
    let updatedReceipt = await Receipt.findByPk(receiptId)
    updatedReceipt.isActive = false
    updatedReceipt.save()
  }
}

module.exports = {
  eventQueries: {
    receipt,
    allReceipts
  },
  eventMutations: {
    addReceipt,
    completeReceipt
  },
  ReceiptType
}
