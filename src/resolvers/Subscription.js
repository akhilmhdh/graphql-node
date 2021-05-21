const newLinkSubscribe = (parent, args, context, info) => {
    return context.pubsub.asyncIterator("NEW_LINK");
};

const newVoteSubscribe = (parent, args, context, info) => {
    return context.pubsub.asyncIterator("NEW_VOTE");
};

const newLink = {
    subscribe: newLinkSubscribe,
    resolve: (payload) => payload,
};

const newVote = {
    subscribe: newVoteSubscribe,
    resolve: (payload) => payload,
};

export default {
    newLink,
    newVote,
};
