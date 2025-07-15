import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import bcrypt from "bcrypt";
import User from "../models/users.model.js";

const Config = {
  usernameField: "email",
  passwordField: "password",
};

passport.use(
  new LocalStrategy(Config, async (email, password, done) => {
    console.log("Attempting local login for:", email);
    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.log("User not found");
        return done(null, false, { message: "User not found" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        console.log("Invalid password");
        return done(null, false, { message: "Invalid password" });
      }

      console.log("Login successful:", user.username);
      return done(null, user);
    } catch (err) {
      console.error("LocalStrategy error:", err);
      return done(err);
    }
  })
);

// JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies["token"];
      }
      return token;
    },
  ]),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

passport.use(
  "jwt",
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload._id);
      if (!user) return done(null, false, { message: "User not found" });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({
          googleid: profile.id,
          username: profile.displayName,
          registerType: "google",
        });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = await User.create({
          email: profile.email,
          username: profile.displayName,
          googleid: profile.id,
          registerType: "google",
        });

        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize & Deserialize (for session-based login)
// passport.serializeUser((user, done) => {
//   done(null, user._id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });

export default passport;
