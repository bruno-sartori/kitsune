import express from 'express';
import AuthController from '@controllers/auth.controller';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '@models/user';

const router = express.Router();
const authController = new AuthController();

if (process.env.API_TYPE === 'server') {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.OAUTH2_CLIENT_ID,
        clientSecret: process.env.OAUTH2_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        // Code to handle user authentication and retrieval
        const user = await User.findOne({ where: { login: profile?.emails?.[0].value } });
        if (user) {
          done(null, user.toJSON());
        } else {
          return done(null, false, {message: "You do not have access to this feature. Please speak with your manager for more information."});
        }
      }
    )
  );
  
  passport.serializeUser((user: Express.User, done) => {
    // Code to serialize user data
    done(null, user);
  });
  
  passport.deserializeUser((user: Express.User, done) => {
    // Code to deserialize user data
    done(null, user);
  });

  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    console.log('AQUI', req.query);
    // Successful authentication, redirect or handle the user as desired
    res.redirect('/');
  });
} else {
  router.post('/register', authController.register);
  router.post('/login', authController.login);
}

export default router;
