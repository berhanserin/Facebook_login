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
      clientID: "440400450893972",
      clientSecret: "254f72bc5811cb7ae69fd2fe3927c96d",
      callbackURL: "http://localhost:5000/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      const { email, first_name, last_name } = profile._raw;
      const userData = {
        email,
        firstName: first_name,
        lastName: last_name,
      };
      console.log(userData);
      done(null, profile);
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
    console.log(req.user);
    req.logIn();
    res.redirect("/login");
  }
);

app.listen(5000, () => {
  console.log(`Server Aktif 🚀🚀🚀🚀`);
});
