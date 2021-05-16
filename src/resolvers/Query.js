export const feed = (parent, args, context, info) => context.prisma.link.findMany();

export default {
    feed,
};
