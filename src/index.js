import { ApolloServer } from "apollo-server";
import fs from "fs";
import path from "path";

let links = [
    {
        id: "link-0",
        url: "www.howtographql.com",
        description: "Fullstack tutorial for GraphQL",
    },
];

let totalLinks = links.length;

const resolvers = {
    Query: {
        info: () => "This clone of hackernews",
        feed: () => links,
    },
    Mutation: {
        post: (parent, args) => {
            const link = {
                id: `link-${totalLinks++}`,
                description: args.description,
                url: args.url,
            };
            links.push(link);
            return link;
        },
        update: (parent, args) => {
            const selectedLink = links.find(({ id }) => id === args.id);

            if (!selectedLink) throw new Error("Field not found");

            selectedLink.url = args.url;
            selectedLink.description = args.description;
            return selectedLink;
        },
        delete: (parent, args) => {
            const selectedLinkIndex = links.findIndex(({ id }) => id === args.id);

            if (selectedLinkIndex === -1) throw new Error("Field not found");

            const deletedLink = links.splice(selectedLinkIndex, 1)[0];
            return deletedLink;
        },
    },
};

const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
    resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running in ${url}`));
