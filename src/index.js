import { ApolloServer, PubSub } from "apollo-server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { getUserId } from "./utils";

import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Link from "./resolvers/Link";
import User from "./resolvers/User";
import Vote from "./resolvers/Vote";
import Subscription from "./resolvers/Subscription";

const prisma = new PrismaClient();
const pubsub = new PubSub();

const resolvers = {
    Query,
    Mutation,
    Link,
    User,
    Vote,
    Subscription,
};

const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
    resolvers,
    context: ({ req }) => ({
        ...req,
        prisma,
        pubsub,
        userId: req && req.headers.authorization ? getUserId(req) : null,
    }),
});

server.listen().then(({ url }) => console.log(`Server is running in ${url}`));
