// bring in arrays of data from sampleData.js
// const { projects, clients } = require("../sampleData.js");

// **** NOTE: GraphQL schema are not the same as Mongoose models.  These schema are only for Queries and Mutations.

// import Mongoose models
const Project = require("../models/Project");
const Client = require("../models/Client")

// bring in GraphQLObjectType, ID, String, List from graphql package
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLEnumType
} = require("graphql");

// Define project type along fields in sampleData.js
const ProjectType = new GraphQLObjectType({
    name: "Project",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                return Client.findById(parent.clientId) // parent is 'Project' model
            }
        }
    })
});
// Define client type along fields in sampleData.js
const ClientType = new GraphQLObjectType({
    name: "Client",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
});

// create root query object to query projects and clients by ID
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        // projects (plural) is query for all clients, no id args necessary
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                // return projects; ========= only used with sampleData.js
                return Project.find(); // this method returns all clients from mongodb
            }
        },
        // project (singular) is query for one client, needs id args
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return projects.find(project => project.id === args.id) ======= used with sampleData.js
                return Project.findById(args.id)

            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                // return clients;
                return Client.find() // this method returns all clients from mongodb
            }
        },
        // client (singular) is query for one client, needs id args
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return clients.find(client => client.id === args.id)
                return Client.findById(parent.clientId)

            }
        }
    }
});

// mutations
const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addClient: {
            type: ClientType,
            args: {
                // GraphQLNonNull = ! on typeDefs, meaning they must be filled in
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) },

            },
            // args is ID
            resolve(parent, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                });
                // save new client to the database
                return client.save();
            }
        },
        // mutation for deleting client by ID
        deleteClient: {
            type: ClientType,
            args: {
                id: {type: GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                return Client.findByIdAndRemove(args.id);
            }
        },
        // Add a project numtation
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: { 
                    type: new GraphQLEnumType({
                        name: "ProjectStatus",
                        values: {
                            "new": { value: "Not started" },
                            "progress": { value: "In progress" },
                            "completed": { value: "Completed" },
                        }
                    }),
                    defaultValue: "Not started",
                },
                clientId: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                });
                return project.save()
            }
        },
        // Delete a project mutation
        deleteProject: {
            type: ProjectType,
            args: { 
                id: { type: GraphQLNonNull(GraphQLID) } 
            },
            resolve(parent, args) {
                return Project.findByIdAndRemove(args.id);
            }
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})