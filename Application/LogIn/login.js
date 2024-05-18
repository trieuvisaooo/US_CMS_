const roleChecking = require("../RoleChecking/role");
const userDB = require("../../Database/UserDatabase/AccessUserAccount");
const bcrypt  = require("bcrypt");
const jwt = require("jsonwebtoken")
// const roleChecking = require("../RoleChecking/index");
module.exports = {
    login: async function (req, res) {
        const rs = await userDB.getUserByID(req.body.username);
        const chucvu = await roleChecking.checkRole(rs.CHUCVU);
        console.log("chucvu" + chucvu);
        const accessToken = jwt.sign({ MSSV: req.body.username,ROLE:chucvu }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.cookie('token', accessToken, { httpOnly: false, sameSite: true, maxAge: "3000000" });
        // res.setHeader('Authorization', `Bearer ${accessToken}`);
        res.set('authorization', accessToken);
        // req.session.token = token ;
        // res.header("fa", "fa1")
        res.redirect('/');
    }
}