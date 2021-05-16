export const links = (parent, args, context) => {
    return context.prisma.user.findUnique({ where: { id: parent.id } }).link();
};

export default {
    links,
};
