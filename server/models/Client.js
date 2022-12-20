// import mongoose for models.  Mongoose schemas are NOT related to graphql schemas
// 3 layers: 1) Mongo database 2) Mongoose schema with fields 3) Graphql types for queries

const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    }, 
    phone: {
        type: String,
    },
});

// in this export is "Client" which will be used in schema.js (graphql API query schema)
module.exports = mongoose.model("Client", ClientSchema)