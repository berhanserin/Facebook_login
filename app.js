const express = require("express");
const res = require("express/lib/response");
const req = require("express/lib/request");
const app = express();
const path = require("path");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
const isLoggedIn = require("./middleware/auth");
const GoogleStrategy = require("passport-google-oauth20");
const TwitterStrategy = require("passport-twitter");
const session = require("express-session");
const mongoose = require("mongoose");
const { User } = require("./models/User");
const authRouter = require("./middleware/authRouter");

app.get("", (req, res) => {
  res.sendFile(path.join(__dirname, "/View/Login.html"));
});

app.use(passport.initialize());
app.set("view engine", "pug");

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "bla bla bla",
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "68043017874-cnr3gf9ci8uns38t9fr9em24co7sunv2.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      return cb(null, profile);
    }
  )
);

passport.use(
  new TwitterStrategy(
    {
      consumerKey: "mooc93VnvuLOPdAJwsRtwhMOs",
      consumerSecret: "TGJGOEh92UXFhKmebyQvdJXTcjd74L9BHtgs4DuJIDJLk6A4to",
      callbackURL: "http://localhost:5000/auth/twitter/callback",
    },
    function (token, tokenSecret, profile, cb) {
      return cb(null, profile);
    }
  )
);

app.get("/auth/twitter", passport.authenticate("twitter"));

app.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  function (req, res) {
    const { displayName, provider } = req.session.passport.user;
    User.create({ displayName, provider }).then(() => {
      res.redirect("/dashboard");
    });
  }
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    const { displayName, provider } = req.session.passport.user;
    User.create({ displayName, provider }).then(() => {
      res.redirect("/dashboard");
    });
  }
);

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
      done(null, profile);
    }
  )
);

app.get("/facebook", isLoggedIn, authRouter.isRouterFacebook, (req, res) => {
  const { displayName, provider } = req.session.passport.user;
  res.render(path.join(__dirname, "/View/facebook.pug"), {
    displayName,
    provider,
  });
});

app.get("/google", isLoggedIn, authRouter.isRouterGoogle, (req, res) => {
  const { displayName, provider } = req.session.passport.user;
  res.render(path.join(__dirname, "/View/google.pug"), {
    displayName,
    provider,
  });
});

app.get("/twitter", isLoggedIn, authRouter.isRouterTwitter, (req, res) => {
  const { displayName, provider } = req.session.passport.user;
  res.render(path.join(__dirname, "/View/twitter.pug"), {
    displayName,
    provider,
  });
});

app.get("/auth/facebook", passport.authenticate("facebook"));

// req.session.passport.user
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    const { displayName, provider } = req.session.passport.user;
    User.create({ displayName, provider }).then(() => {
      res.redirect("/facebook");
    });
  }
);

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

mongoose
  .connect(`mongodb://localhost:27017/login`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(5000, () => {
      console.log(`Server Aktif 🚀🚀🚀🚀`);
    });
  })
  .catch((hata) => {
    console.log(`${hata}`);
  });
