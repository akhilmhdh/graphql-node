export const postedBy = (parent, args, context) => {
    return context.prisma.link.findUnique({ where: { id: parent.id } }).postedBy();
};

export const votes = (parent, args, context) => {
    return context.prisma.link.findUnique({ where: { id: parent.id } }).votes();
};

export default {
    postedBy,
    votes,
};
