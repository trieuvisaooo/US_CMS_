const passport = require('passport');
const MyStrategy = require('../utils/customSPP');
const accM = require("../Database/UserDatabase/AccessUserAccount")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// const session = require("session");
passport.serializeUser((user, done) => {
    done(null, user.username);
});
passport.deserializeUser(async (un, done) => {
    const u = await accM.getUserByUsername(un);
    if (!u) {
        return done('invalid', null);
    }
    done(null, u);
});
module.exports = app => {

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new MyStrategy(async (un, pw, done) => {
       
        const rs = await accM.getUserByID(un);
        let auth = false;
        if (rs) {
            auth = await bcrypt.compare(pw, rs.password);
        }
  
        if (auth) {
           
            const accessToken = jwt.sign({ username: un }, "key", { expiresIn: "30s" });
            return done(null, rs,accessToken);
        }
        done('invalid auth');
    }, {
        username: 'un',
        password: 'pw'
    }));
};