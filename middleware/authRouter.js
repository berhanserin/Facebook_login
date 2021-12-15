const isRouterFacebook = (req, res, next) => {
  if (req.session.passport.user.provider == "facebook") {
    next();
  } else {
    res.redirect("/");
  }
};

const isRouterGoogle = (req, res, next) => {
  if (req.session.passport.user.provider == "google") {
    next();
  } else {
    res.redirect("/");
  }
};

const isRouterTwitter = (req, res, next) => {
  if (req.session.passport.user.provider == "twitter") {
    next();
  } else {
    res.redirect("/");
  }
};

module.exports = { isRouterFacebook, isRouterGoogle, isRouterTwitter };
