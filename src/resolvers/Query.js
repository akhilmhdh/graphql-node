export const feed = async (parent, args, context, info) => {
    const where = args.filter
        ? {
              OR: [{ description: { contains: args.filter } }, { url: { contains: args.url } }],
          }
        : {};

    const links = await context.prisma.link.findMany({
        where,
        skip: args.skip,
        take: args.limit,
        orderBy: args.orderBy,
    });

    const count = await context.prisma.link.count({ where });

    return {
        links,
        count,
    };
};

export const info = () => "Something graphql trail!!";

export default {
    feed,
    info,
};
