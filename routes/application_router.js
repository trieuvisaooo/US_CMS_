require("dotenv").config();
const app = require('express');
const router = app.Router();
const control = require("../Application/LogIn/login_view");
const loginControl = require("../Application/LogIn/login");
const clubInfoControl = require("../Application/ViewClubInformation/club_info")
const User = require("../Database/UserDatabase/AccessUserAccount")
const passport = require('passport')
const app1 = app();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mws = require("../mws/middlewareController")
const interact = require("../Business/InteractWithPosts/postlove")

var LocalStrategy = require('passport-local').Strategy;
router.get("/signin", control.signin);
router.get("/signup1", control.signup1);
// router.post("/login",loginControl.login);
router.use(passport.initialize());
router.use(passport.session());

router.use(app.urlencoded({ extended: false }));

passport.use(new LocalStrategy(async (username, password, done) => {
    // console.log(`username:::${username}, pass::::${ password}`);
    const rs = await User.getUserByID(username);
    // console.log(rs);
    let auth = false;
    if (rs) {
        auth = await bcrypt.compare(password, rs.MATKHAU);
    }

    if (auth) {
        return done(null, rs);
    }
    // done('invalid auth');
    done(null, false, { message: 'bad password' })
}));
passport.serializeUser((user, done) => done(null, user.MSSV));
passport.deserializeUser((username, done) => {
  
    done(null, false)
});
router.post('/login',
    passport.authenticate('local', { failureRedirect: '/application/signin', failureMessage: 'Invalid username or password', failureFlash: 'Invalid username or password' }),
    // function (req, res) {
    //     console.log(req.body);
    //     const accessToken = jwt.sign({ MSSV: req.body.username }, process.env.SECRET_KEY, { expiresIn: "1h" });
    //     res.cookie('token', accessToken, { httpOnly: false, sameSite: true, maxAge: "3000000" });
    //     // res.setHeader('Authorization', `Bearer ${accessToken}`);
    //     res.set('authorization', accessToken);
    //     // req.session.token = token ;
    //     // res.header("fa", "fa1")
    //     res.redirect('/');
    // }
    loginControl.login
    );
router.post("/referralChecking", control.check_referral)
router.post("/confirm_psw", control.confirm_psw)
router.get("/forgetpassword", control.forget_password)
router.post("/forgetpassword", control.forgetpass_process)
router.get("/signout", function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.clearCookie('token')
        res.redirect('/');
    });
})
router.get("/viewactivity", mws.verifyToken,clubInfoControl.viewActivity)
router.get("/viewpost",mws.verifyToken, clubInfoControl.viewPost)

module.exports = router;
