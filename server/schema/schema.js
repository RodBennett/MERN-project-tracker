// bring in arrays of data from sampleData.js
const { projects, clients } = require("../sampleData.js");

// bring in GraphQLObjectType, ID, String, List from graphql package
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLSchema
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
                return clients.find((client) => client.id === parent.clientId) // parent is projects
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

// create root query object to query clients by ID
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        // projects (plural) is query for all clients, no id args necessary
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return projects;
            }
        },
        // project (singular) is query for one client, needs id args
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return projects.find(project => project.id === args.id)
            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return clients;
            }
        },
        // client (singular) is query for one client, needs id args
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return clients.find(client => client.id === args.id)
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})