import { ApolloServer } from "apollo-server";

let links = [
    {
        id: "link-0",
        url: "www.howtographql.com",
        description: "Fullstack tutorial for GraphQL",
    },
];

const typeDefs = `
type Query {
  info: String!
  feed: [Link!]!
}

type Link {
    id: ID!
    description: String!
    url: String!
}
`;

const resolvers = {
    Query: {
        info: () => "This clone of hackernews",
        feed: () => links,
    },
    // Link: {
    //     id: (parent) => parent.id,
    //     description: (parent) => parent.description,
    //     url: (parent) => parent.url,
    // } Just to understand under the hood,
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running in ${url}`));
