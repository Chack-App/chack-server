const Sequelize = require("sequelize");
const db = require("../db");

const Receipt = db.define("receipts", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  cardDownId: {
    type: Sequelize.INTEGER,
  },
  isPaid: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Receipt;

// const completeReceipt = (receipt) => {
//     if(receipt.isPaid === true){      // Prevent updating receipts that have already been completed
//         throw new Error("You cannot update a completed receipt")
//     }
//     else if (receipt.changed("isPaid")) {   // mark receipt as completed
//         receipt.isPaid = true;
//         return receipt
//     }
// };


// Receipt.beforeUpdate(completeReceipt)
// Receipt.beforeBulkUpdate((receipts) => receipts.map(completeReceipt))


