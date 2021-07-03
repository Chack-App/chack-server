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
  isComplete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  completedAt: {
    type: Sequelize.DATE,
    validate: {
      notEmpty: true,
    },
  },
});

module.exports = Event;

//class methods
const completeEvent = (event) => {
    if(event.isComplete === true){      // Prevent updating events that have already been completed
        throw new Error("You cannot update a completed event")     
    }
    else if (event.changed("isComplete")) {   // mark event as completed and add completion date
        event.isComplete = true;
        event.completedAt = Date.now()
    }
};

Event.beforeUpdate(completeEvent)
Event.beforeBulkUpdate((events) => events.map(completeEvent))