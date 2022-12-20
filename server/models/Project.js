// import mongoose for models.  Mongoose schemas are NOT related to graphql schemas
// 3 layers: 1) Mongo database 2) Mongoose schema with fields 3) Graphql types for queries

const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    }, 
    status: {
        type: String,
        enum: ["Not started", "In progress", "Completed"]
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client"
    }
});

// in this export is "Project" which will be used in schema.js (graphql API query schema)
module.exports = mongoose.model("Project", ProjectSchema)