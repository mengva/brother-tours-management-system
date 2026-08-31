import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { redis } from "@/server/lib/redis";
import { MailServices } from "@/server/lib/mail";
import { AppError, CookieServices, handleTRPCError, Helper, resetTokenName, resetTokenSignInName, tokenName, type MailOptionsDto } from "@/server/utils";
import type { UserRoleDto } from "@/server/packages/types";
import type { ZodValidationServerResetPassword } from "@/server/packages/validations";
import db from "@/server/config/db";
import { customers, userCredentials, users } from "@/server/db";
import { getCookie, setCookie } from "hono/cookie";
import { SendCodeResetPasswordDto, SendCodeSignInOTPDto, SignInDto, SignInOTPDto, SignUpDto } from "../types";
import type { Context as HonoContext } from 'hono';


export class AuthServices {

    public static async signIn({
        email,
        password,
        userAgent,
        deviceFingerprint
    }: SignInDto): Promise<string> {
        try {

            // 2. Query user by email, role, and active status
            // Removed userAgent from the 'where' clause to allow login from new devices
            const userInfo = await db.query.users.findFirst({
                where: (users, { eq, and }) => and(
                    eq(users.email, email),
                    eq(users.isActive, true),
                ),
                with: {
                    credentials: true
                }
            });

            // 3. Check if user exists
            if (!userInfo) {
                throw new AppError("Invalid credentials or account is inactive", "NOT_FOUND");
            }

            const passwordHash = userInfo.credentials?.passwordHash ?? "";

            // 4. Verify password with bcrypt
            const match = await Helper.bcryptCompare(password, passwordHash);
            if (!match) {
                throw new AppError("Invalid credentials", "UNAUTHORIZED");
            }

            // 5. Update the latest userAgent in the database
            // This ensures the DB stays synced with the current device
            await db.update(users)
                .set({ userAgent: userAgent })
                .where(eq(users.id, userInfo.id));

            // 6. Prepare JWT Payload
            const userPayload = {
                userId: userInfo.id,
                role: userInfo.role as UserRoleDto,
                deviceFingerprint: deviceFingerprint,
            };

            // 7. Generate and set access token in cookies
            const token = await Helper.generateToken(userPayload);

            return token;
        } catch (error) {
            throw handleTRPCError(error);
        }
    }

    public static async signUp({
        email,
        password,
        phoneNumber,
        whatsappNumber,
        fullName,
        gender,
        userAgent,
    }: SignUpDto) {
        try {

            // 3. Prevent duplicate account states by matching unique structural anchors
            const existingUser = await db.query.users.findFirst({
                where: (users, { or, eq }) =>
                    and(
                        or(
                            eq(users.email, email),
                            eq(users.phoneNumber, phoneNumber)
                        ),
                        eq(users.isActive, true)
                    )
            });

            if (existingUser) {
                throw new AppError("Email or phone number already exists", "CONFLICT");
            }

            const existingCustomer = (await db.query.customers.findFirst({
                where: (customers, { or, eq }) =>
                    or(
                        eq(customers.email, email),
                        eq(customers.phoneNumber, phoneNumber),
                        eq(customers.whatsappNumber, whatsappNumber)
                    ),
                columns: {
                    id: true,
                    fullName: true,
                    email: true,
                    phoneNumber: true,
                    whatsappNumber: true,
                }
            })) || null;

            // 4. Secure plain text secrets prior to persistence exposure bounds
            const hashPassword = await Helper.bcryptHash(password);

            // 5. Execute unified isolation transaction boundaries
            return await db.transaction(async (tx) => {
                // Step A: Insert general user identity information
                const [{ userId }] = await tx
                    .insert(users)
                    .values({
                        fullName: fullName,
                        email: email,
                        phoneNumber: phoneNumber,
                        gender: gender,
                        userAgent: userAgent,
                        role: "Customer" as UserRoleDto,
                        isActive: true,
                    })
                    .returning({
                        userId: users.id,
                    });

                if (!existingCustomer) {
                    await tx.insert(customers).values({
                        userId,
                        fullName: fullName,
                        email: email,
                        phoneNumber: phoneNumber,
                        gender: gender,
                        whatsappNumber: whatsappNumber
                    });
                } else {
                    await tx.update(customers).set({
                        userId,
                    });
                }
                // Step B: Bind isolation login security data bounds
                await tx.insert(userCredentials).values({
                    userId,
                    passwordHash: hashPassword,
                });

                return {
                    userId
                };
            });
        } catch (error) {
            throw handleTRPCError(error);
        }
    }

    public static async sendCodeSignInOTP({
        email,
        ctx
    }: SendCodeSignInOTPDto) {
        try {
            // 1. Check if user exists in the Database
            const user = await db.query.users.findFirst({
                where: (users, { eq, and }) => and(
                    eq(users.email, email),
                    eq(users.isActive, true)
                )
            });

            if (!user) {
                throw new AppError("User not found", "NOT_FOUND");
            }

            // 2. Generate a 6-digit random code
            const otpCode = Helper.generateOTP(); // e.g., "123456"

            // 3. Store in Redis with an expiration (e.g.,   300 seconds)
            // Key format: "reset_password:email@example.com"
            const resetToken = crypto.randomUUID(); // raomdom token for reset password session
            await redis.set(`reset_email_sign_in:${resetToken}`, email, { ex: 300 }); // get email in token
            await redis.set(`sign_in_otp:${email}`, otpCode, { ex: 60 }) // get otp code

            setCookie(ctx, resetTokenSignInName, resetToken, {
                httpOnly: true,
                secure: true,
                maxAge: 300 // 5 minutes
            })

            // 4. SEND THE EMAIL using our new Helper
            const emailSent = MailServices.sendResetCodeEmailSignIn(email, otpCode) as MailOptionsDto;

            if (!emailSent) {
                throw new AppError("Failed to send email. Please try again later.", "INTERNAL_SERVER_ERROR");
            }

            const transporter = Helper.transporter();
            await transporter.sendMail(emailSent);

        } catch (error) {
            throw handleTRPCError(error);
        }
    }

    public static async resendCodeSignInOTP(ctx: HonoContext) {
        try {
            const tokenFromCookie = getCookie(ctx, resetTokenSignInName);
            const emailFromRedis = await redis.get(`reset_email_sign_in:${tokenFromCookie}`); // Get email associated with the OTP code

            if (!emailFromRedis) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "Session expired" });
            }

            const otpCode = Helper.generateOTP(); // e.g., "123456"

            const emailSent = MailServices.sendResetCodeEmailSignIn(emailFromRedis as string, otpCode) as MailOptionsDto;

            if (!emailSent) {
                throw new AppError("Failed to send email. Please try again later.", "INTERNAL_SERVER_ERROR");
            }

            const transporter = Helper.transporter();
            await transporter.sendMail(emailSent);
        } catch (error) {
            throw handleTRPCError(error);
        }
    }

    public static async signInOTP({
        code,
        ctx,
        userAgent,
        deviceFingerprint
    }: SignInOTPDto) {
        try {

            const tokenFromCookie = getCookie(ctx, resetTokenSignInName);
            const emailFromRedis = await redis.get(`reset_email_sign_in:${tokenFromCookie}`); // Get email associated with the OTP code

            if (!emailFromRedis) {
                throw new AppError("Session expired", "UNAUTHORIZED");
            }

            // 2. verify OTP code with Redis
            const storedCode = await redis.get(`sign_in_otp:${emailFromRedis as string}`);
            if (!storedCode || storedCode !== code) {
                throw new AppError("Invalid or expired OTP code", "UNAUTHORIZED");
            }

            // 3. Query user by email, role, and active status
            // Removed userAgent from the 'where' clause to allow login from new devices
            const userInfo = await db.query.users.findFirst({
                where: (users, { eq, and }) => and(
                    eq(users.email, emailFromRedis as string),
                    eq(users.isActive, true)
                )
            });

            // 4. Check if user exists
            if (!userInfo) {
                throw new AppError("Invalid credentials or account is inactive", "NOT_FOUND");
            }

            // 5. Update the latest userAgent in the database
            // This ensures the DB stays synced with the current device
            await db.update(users)
                .set({ userAgent: userAgent })
                .where(eq(users.id, userInfo.id));

            // 6. Prepare JWT Payload
            const userPayload = {
                userId: userInfo.id,
                role: userInfo.role,
                deviceFingerprint: deviceFingerprint,
            };

            // 7. Generate and set access token in cookies
            const token = await Helper.generateToken(userPayload);

            await redis.del(`sign_in_otp:${emailFromRedis as string}`); // Clear OTP from Redis after successful login
            await redis.del(`reset_email_sign_in:${tokenFromCookie}`);
            setCookie(ctx, resetTokenSignInName, "", { maxAge: 0 }); // Clear the OTP session cookie

            setCookie(ctx, tokenName, token, CookieServices.option);

        } catch (error) {
            throw handleTRPCError(error);
        }
    }

    public static async generateCodeResetPassword(email: string) {
        try {
            // 1. Generate 6-digit OTP
            const resetCode = Helper.generateOTP(); // e.g. "123456"

            // 2. Prepare email first
            const emailOptions = MailServices.sendResetCodeEmail(email, resetCode) as MailOptionsDto;

            if (!emailOptions) {
                throw new AppError("Failed to prepare email. Please try again later.", "INTERNAL_SERVER_ERROR");
            }

            // 3. Send email
            const transporter = Helper.transporter();
            await transporter.sendMail(emailOptions);

            // 4. Only save to Redis AFTER email is successfully sent
            await redis.set(`reset_password:${email}`, resetCode, { ex: 60 }); // 60 seconds

        } catch (error) {
            throw handleTRPCError(error);
        }
    }

    // using to send OTP code to email for sign in and reset password, so no need to check user agent and role here
    public static async sendCodeResetPassword({
        email,
        ctx
    }: SendCodeResetPasswordDto) {
        try {

            // 1. Check if user exists in the Database
            const user = await db.query.users.findFirst({
                where: (users, { eq, and }) => and(
                    eq(users.email, email),
                    eq(users.isActive, true)
                ),
            });

            // Security Tip: Don't reveal if email exists or not
            // Just say "If an account exists, an email has been sent"
            if (!user) {
                throw new AppError("If an account exists with that email, a reset code has been sent", "NOT_FOUND");
            }

            await this.generateCodeResetPassword(email);
            const resetToken = crypto.randomUUID(); // raomdom token for reset password session
            await redis.set(`reset_session:${resetToken}`, email, { ex: 300 }); // get email in token

            setCookie(ctx, resetTokenName, resetToken, {
                httpOnly: true,
                secure: true,
                maxAge: 300 // 5 minutes
            });

        } catch (error) {
            throw handleTRPCError(error);
        }
    }

    public static async resendCodeResetPassword(ctx: HonoContext) {
        try {
            // 1. Get reset session token from cookie
            const reset_token = getCookie(ctx, resetTokenName);

            if (!reset_token) {
                throw new AppError("Session expired or invalid", "UNAUTHORIZED");
            }

            // 2. Get email from Redis session
            const emailFromRedis = await redis.get(`reset_session:${reset_token}`);

            if (!emailFromRedis) {
                throw new AppError("Session expired", "UNAUTHORIZED");
            }

            // 3. Resend OTP
            return await this.generateCodeResetPassword(emailFromRedis as string);

        } catch (error) {
            throw handleTRPCError(error);
        }
    }

    public static async resetPassword({
        input,
        ctx
    }: {
        input: ZodValidationServerResetPassword;
        ctx: HonoContext;
    }) {
        try {
            // 1. Extract validation data from request body
            // Note: Email is no longer required in the body for enhanced security.
            const { code, password } = input as ZodValidationServerResetPassword;

            // 2. Retrieve the reset session from the secure cookie
            const resetToken = getCookie(ctx, resetTokenName);

            // 3. Look up the associated email from Redis using the token
            const email = await redis.get(`reset_session:${resetToken}`) as string || null;

            if (!email) {
                throw new AppError("Reset session has expired. Please restart the process.", "UNAUTHORIZED");
            }

            const userInfo = await db.query.users.findFirst({
                where: (users, { eq, and }) => and(
                    eq(users.email, email),
                    eq(users.isActive, true),
                ),
            });

            if (!userInfo) {
                throw new AppError("User not found", "NOT_FOUND");
            }

            // 4. Verify the OTP (One-Time Password) from Redis
            const storedCode = await redis.get(`reset_password:${email}`) as string || null;

            if (!storedCode || storedCode !== code) {
                throw new AppError("Invalid or expired reset code.", "BAD_REQUEST");
            }

            // 5. Hash the new password before storing it
            const hashedPassword = await Helper.bcryptHash(password);

            // 6. Update the user's password in the database
            await db.update(userCredentials)
                .set({ passwordHash: hashedPassword })
                .where(eq(userCredentials.userId, userInfo.id));

            // 7. Cleanup: Delete session and OTP data from Redis to prevent reuse
            await redis.del(`reset_password:${email as string}`);
            await redis.del(`reset_session:${resetToken}`);

            // 8. Clear the secure reset cookie from the client's browser
            setCookie(ctx, resetTokenName, "", { maxAge: 0 });

        } catch (error) {
            throw handleTRPCError(error);
        }
    }
}