// import express.js
const express = require("express");
const colors = require("colors");
const cors = require("cors");
// import dotenv to create .env variables
require("dotenv").config();
// import express-graphql to use graphiql during development
const { graphqlHTTP } = require("express-graphql");
// import schema.js with object types defined
const schema = require("./schema/schema")
// set up PORT via .env
const port = process.env.PORT || 5000;
// variable to connect to mongodb from db.js
const connectDB = require("./config/db")

const app = express();

// Call mongodb via connectDB from db.js:
connectDB();
// call middleware for cors
app.use(cors());
// define url endpoint to test queries in graphiql tool during development @ http://localhost:5001/graphql.  "schema" where types and have been defined has been imported on line 4. And as long as we're in 'npm run dev' mode, graphiql will open on url
app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
}))

app.listen(port, console.log(`Server running on port ${port}!`))

