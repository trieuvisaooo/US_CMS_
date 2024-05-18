const { Strategy } = require('passport-strategy');
const passport = require('passport');
module.exports = class MyStrategy extends Strategy {
    constructor(verify, options) {
        super();
        this.name = 'myS'; // Set a name for your strategy
        this.verify = verify; // Set the verify function for authentication // Any additional options or configuration can be handled here.
        this.usernameField = (options && options.username) ? options.username : 'username';
        this.passwordField = (options && options.password) ? options.password : 'password';
        passport.strategies[this.name] = this; // Register the strategy with Passport
    }
    authenticate(req, options) {
        // Implement the authentication logic here
        // Call this.success(user, info) if authentication is successful
        // Call this.fail(info) if authentication fails.
   
        const un = req.body.user_account;
        const pw = req.body.user_password;
        this.verify(un, pw, (err, user) => {
            if (err) {
                return this.fail(err);
            }
            if (!user) {
                return this.fail('invalid auth');
            }
            this.success(user);
        });
    }
}
