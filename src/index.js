import { ApolloServer } from "apollo-server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const resolvers = {
    Query: {
        info: () => "This clone of hackernews",
        feed: async (parent, args, context) => await context.prisma.link.findMany(),
    },
    Mutation: {
        post: async (parent, args) => {
            const newLink = await context.prisma.link.create({
                data: {
                    description: args.description,
                    url: args.url,
                },
            });
            return newLink;
        },
        update: async (parent, args, context) => {
            const updatedLink = await context.prisma.link.update({
                where: {
                    id: +args.id,
                },
                data: {
                    url: args.url,
                    description: args.description,
                },
            });
            return updatedLink;
        },
        delete: async (parent, args, context) => {
            return await context.prisma.link.delete({
                where: {
                    id: +args.id,
                },
            });
        },
    },
};

const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
    resolvers,
    context: {
        prisma,
    },
});

server.listen().then(({ url }) => console.log(`Server is running in ${url}`));
