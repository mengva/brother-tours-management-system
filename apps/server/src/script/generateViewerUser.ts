import db from "../config/db";
import { Helper } from "../utils";
import { getUserAgent } from "../server/trpc/context";
import { Context as HonoContext } from "hono";
import { userCredentials, users } from "../db";

export const generateViewerUser = async (ctx: HonoContext) => {
    try {
        const viewerEmail = "viewer@brothertours.com";

        const userAgent = getUserAgent(ctx);

        if (!userAgent) {
            console.warn("User agent is not available. Setting it to an empty string.");
            return;
        }

        const userInfo = await db.query.users.findFirst({
            where: (users, { eq, and }) => and(
                eq(users.email, viewerEmail),
                eq(users.isActive, true),
            ),
        });

        if (userInfo) {
            console.warn("User already exists.");
            return;
        }

        const viewerPassword = "Viewer@123"

        const hashedPassword = await Helper.bcryptHash(viewerPassword);

        await db.transaction(async (tx) => {

            const [newUser] = await tx.insert(users).values({
                fullName: "Viewer User",
                email: viewerEmail,
                gender: "male",
                phoneNumber: "2099887744",
                role: "Viewer",
                userAgent: userAgent,
                permissions: ["Read"]
            }).returning().execute();

            if (!newUser) {
                console.warn("Failed to create new user.");
                return;
            }

            await tx.insert(userCredentials).values({
                passwordHash: hashedPassword,
                userId: newUser.id,
            }).onConflictDoNothing().execute();

            console.log("User generated successfully.");

        });

        // You can also add logic here to generate an access token for the new user if needed
        // const token = await Helper.generateToken({ userId: newUserId, role: "Owner" });
        // console.log("Generated token for new user:", token);

        // logic to auto signup users
    } catch (error) {
        console.warn("Error occurred while generating user:", error);
    }
}