export const feed = (parent, args, context, info) => context.prisma.link.findMany();

export const info = () => "Something graphql trail!!";

export default {
    feed,
    info,
};
