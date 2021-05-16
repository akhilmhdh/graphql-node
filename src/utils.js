import jwt from "jsonwebtoken";

export const APP_SECRET = "this_must_be_somewhere_in_env";

export const getTokenPayload = (token) => jwt.verify(token, APP_SECRET);

export const getUserId = (req, authToken) => {
    if (req) {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.replace("Bearer", "");

            if (!token) {
                throw new Error("No token found");
            }
            const { userId } = getTokenPayload(authToken);
            return userId;
        } else if (authToken) {
            const { userId } = getTokenPayload(authToken);
            return userId;
        }
    }

    throw new Error("Not authenticated!!!");
};