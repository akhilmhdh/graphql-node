import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { APP_SECRET, getUserId } from "../utils";

const signup = async (parent, args, context, info) => {
    const password = await bcrypt.hash(args.password, 10);

    const user = await context.prisma.user.create({ data: { ...args, password } });

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user,
    };
};

const login = async (parent, args, context, info) => {
    const user = await context.prisma.user.findUnique({ where: { email: args.email } });

    if (!user) {
        throw new Error("No such user found!!");
    }

    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
        throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user,
    };
};

const createPost = async (parent, args, context) => {
    const { userId } = context;

    const newLink = await context.prisma.link.create({
        data: {
            description: args.description,
            url: args.url,
            postedBy: { connect: { id: userId } },
        },
    });

    context.pubsub.publish("NEW_LINK", newLink);
    return newLink;
};

const updatePost = async (parent, args, context) => {
    const { userId } = context;
    const fetchUserLink = await context.prisma.link.findFirst({
        where: {
            id: +args.id,
            postedById: +userId,
        },
    });

    if (!fetchUserLink) {
        throw new Error("Unauthorized access");
    }

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
};

const deletePost = async (parent, args, context) => {
    const { userId } = context;
    const fetchUserLink = await context.prisma.link.findFirst({
        where: {
            id: +args.id,
            postedById: +userId,
        },
    });

    if (!fetchUserLink) {
        throw new Error("Unauthorized access");
    }
    return await context.prisma.link.delete({
        where: {
            id: +args.id,
        },
    });
};

export const vote = async (parent, args, context) => {
    const userId = getUserId(context);

    const fetchExistingVote = await context.prisma.vote.findUnique({
        where: {
            linkId_userId: {
                linkId: +args.linkId,
                userId: userId,
            },
        },
    });

    if (Boolean(fetchExistingVote)) {
        throw new Error(`Already voted for link: ${args.linkId}`);
    }

    const newVote = await context.prisma.vote.create({
        data: {
            user: { connect: { id: userId } },
            link: { connect: { id: +args.linkId } },
        },
    });

    context.pubsub.publish("NEW_VOTE", newVote);

    return newVote;
};

export default {
    signup,
    login,
    createPost,
    updatePost,
    deletePost,
    vote,
};
