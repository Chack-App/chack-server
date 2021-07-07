const Sequelize = require("sequelize");
const db = require("../db:");

const Receipt = db.define("receipts", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

const completeReceipt = (receipt) => {
    if(receipt.isActive === false){      // Prevent updating receipts that have already been completed
        throw new Error("You cannot update a completed receipt")     
    }
    else if (receipt.changed("isActive")) {   // mark receipt as completed 
        receipt.isComplete = false;
    }
};


Receipt.beforeUpdate(completeReceipt)
Receipt.beforeBulkUpdate((receipts) => receipts.map(completeReceipt))


module.exports = Receipt;
