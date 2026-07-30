import db from "../config/db";
import { Helper } from "../utils";
import { getUserAgent } from "../server/trpc/context";
import { Context as HonoContext } from "hono";
import { userCredentials, users } from "../db";

export const generateUser = async (ctx: HonoContext) => {
    try {
        const email = "mengvaprogamemin@gmail.com";

        const userAgent = getUserAgent(ctx);

        if (!userAgent) {
            console.warn("User agent is not available. Setting it to an empty string.");
            return;
        }

        const userInfo = await db.query.users.findFirst({
            where: (users, { eq, and }) => and(
                eq(users.email, email),
                eq(users.isActive, true),
            ),
        });

        if (userInfo) {
            console.warn("User already exists.");
            return;
        }

        // const password = "yerleeRental09@&.com";
        const password = "Mengva004@";

        const hashedPassword = await Helper.bcryptHash(password);

        await db.transaction(async (tx) => {

            const [newUser] = await tx.insert(users).values({
                fullName: "Mengva chuepor",
                email: email,
                gender: "male",
                phoneNumber: "2057364321",
                role: "Admin",
                userAgent: userAgent,
                permissions: ["Create", "Delete", "Read", "Update", "Rollback"]
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