const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;


passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
passport.use(new FacebookStrategy({
  clientID: "2013140338853529",
  clientSecret: "59bedff9673eef37d5aafd4ec17da69a",
  callbackURL: "http://localhost:8000/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
));