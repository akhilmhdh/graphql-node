import { ApolloServer } from "apollo-server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { getUserId } from "./utils";

import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Link from "./resolvers/Link";
import User from "./resolvers/User";

const prisma = new PrismaClient();

const resolvers = {
    Query,
    Mutation,
    Link,
    User,
};

const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
    resolvers,
    context: ({ req }) => ({
        ...req,
        prisma,
        userId: req && req.headers.authorization ? getUserId(req) : null,
    }),
});

server.listen().then(({ url }) => console.log(`Server is running in ${url}`));
