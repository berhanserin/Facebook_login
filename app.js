const express = require("express");
const res = require("express/lib/response");
const req = require("express/lib/request");
const app = express();
const path = require("path");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
const isLoggedIn = require("./middleware/auth");

app.get("", (req, res) => {
  res.sendFile(path.join(__dirname, "/View/Login.html"));
});

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: "2013140338853529",
      clientSecret: "59bedff9673eef37d5aafd4ec17da69a",
      callbackURL: "http://localhost:5000/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(accessToken);
      return done(null, profile);
    }
  )
);

app.get("/login", isLoggedIn, (req, res) => {
  res.send(`Hello world ${req.user.displayName}`);
});

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    req.logIn(true);
    res.redirect("/login");
  }
);

app.listen(5000, () => {
  console.log(`Server Aktif 🚀🚀🚀🚀`);
});
