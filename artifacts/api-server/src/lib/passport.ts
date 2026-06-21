import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createToken } from "./auth";

export function configureGooglePassport(): void {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        scope: ["profile", "email"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value;
          const name =
            profile.displayName ||
            (profile.name?.givenName || "") + " " + (profile.name?.familyName || "") ||
            "";
          const pictureUrl = profile.photos?.[0]?.value;

          if (!googleId || !email) {
            return done(new Error("Invalid Google profile data"), false);
          }

          const [existingUser] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.googleId, googleId));

          if (existingUser) {
            if (existingUser.googlePictureUrl !== pictureUrl) {
              await db
                .update(usersTable)
                .set({ googlePictureUrl: pictureUrl })
                .where(eq(usersTable.id, existingUser.id));
            }
            const token = createToken(existingUser.id);
            return done(null, { ...existingUser, token });
          }

          const [emailUser] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

          if (emailUser) {
            await db
              .update(usersTable)
              .set({ googleId, googlePictureUrl: pictureUrl })
              .where(eq(usersTable.id, emailUser.id));
            const token = createToken(emailUser.id);
            return done(null, { ...emailUser, token });
          }

          const [newUser] = await db
            .insert(usersTable)
            .values({
              name: name || email.split("@")[0],
              email,
              password: "",
              googleId,
              googlePictureUrl: pictureUrl,
              role: "user",
              isActive: true,
            })
            .returning();

          const token = createToken(newUser.id);
          return done(null, { ...newUser, token });
        } catch (error) {
          return done(error as Error, false);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => done(null, user));
  passport.deserializeUser((user: any, done) => done(null, user));
}
