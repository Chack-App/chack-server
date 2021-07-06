const express = require("express");
const path = require("path");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const schema = require("../schema/");
const passport = require("passport");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const { db } = require("./db/index");
const sessionStore = new SequelizeStore({ db });

const PORT = 8000;

const app = express();
module.exports = app;

//passport registration
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.users.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

//logging middleware
const morgan = require("morgan");

const generateApp = () => {
  app.use(cors());
  //logging
  app.use(morgan("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    session({
      secret: "changeMe",
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  //api routes

  //graphql
  app.use(
    "/graphql",
    graphqlHTTP((req, res, graphQLParams) => {
      return {
        schema,
        graphiql: true,
        // context: {
        //   authorization: req.headers.authorization,
        // },
      };
    })
  );

  //static assets
  app.use(express.static(path.join(__dirname, "../public")));

  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error("Not found");
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, "..", "public/index.html"))
  );

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "public/index.html"));
  });

  app.use(function (error, req, res) {
    console.error(error);
    console.error(error.stack);
    res
      .status(error.status || 500)
      .send(error.message || "Internal server error.");
  });
};

const appListen = () => {
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
};

async function init() {
  await db.sync();
  await generateApp();
  await appListen();
}

init();
