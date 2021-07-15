const Sequelize = require("sequelize");
const db = require("../db");

const Event = db.define("events", {
  eventName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: Sequelize.STRING,
  },
  passcode: {
    type: Sequelize.STRING,
  },
  isComplete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  completedAt: {
    type: Sequelize.DATE,
  },
});

module.exports = Event;

//class methods
// const completeEvent = (event) => {
//     if(event.isComplete === true){      // Prevent updating events that have already been completed
//         throw new Error("You cannot update a completed event")
//     }
//     else if (event.changed("isComplete")) {   // mark event as completed and add completion date
//         // if any active receipts remain in Event throw Error!!!!!
//         event.isComplete = true;
//         event.completedAt = Date.now()
//     }
// };

const generatePasscode = async (event) => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // Make 10 attempts to generate unique passcode
  for (let i = 0; i < 10; i++) {
    // Generate random 4 digit passcode
    let passcode = "";
    for (let i = 0; i < 4; i++) {
      passcode += chars[Math.floor(Math.random() * chars.length)];
    }
    let found = await Event.findAll({
      where: {passcode}
    })
    if (!found.length) {
      event.passcode = passcode;
      return;
    }
  }
  throw new Error('Unique passcode not available');
}

// Event.beforeUpdate(completeEvent)
// Event.beforeBulkUpdate((events) => events.map(completeEvent))
Event.beforeCreate(generatePasscode)
