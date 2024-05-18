const session = require('express-session');
const userDB = require('../../Database/UserDatabase/AccessUserAccount.js')

const default_ref_code = '1'
let currentUser = ''

module.exports = {
    
    signin: async (req, res) => {
        
        try{
            const auth = req.session.flash.error[0];
            // const err = "Tài khoản hoặc mật khẩu không hợp lệ"
            if (auth) {
                res.render("signin", { layout: false ,err: auth,isSignUp: true, isSignIn:false});

            }
            else {
                res.render("signin", { layout: false ,isSignUp: true, isSignIn:false});

            }
        }
        catch(err)
        {
            res.render("signin", { layout: false,isSignUp: true, isSignIn:false });

        }
        
        
    },
    signup1: async (req,res)=>{
        res.render("signup1",{layout:false, isSignUp: false, isSignIn:true});
    },

    check_referral: async(req,res)=>{
        const student_id = req.body.student_id
        const referral_code = req.body.referral_code
        let user_refferal_code = ''

        console.log(user_refferal_code)
        // check user existed
        if (await userDB.checkExisted(student_id)) {
            //res.send(`<h1>User ${student_id} existed </h1>`)
            res.render('signup1', {layout:false, existedUser: true, student_id: student_id})
        }
        else {
            // check referral code
            const query_res = await userDB.get_refferal_code(student_id)
            console.log(query_res)
            if (query_res.rows.length > 0) {
                user_refferal_code = query_res.rows[0].MAGIOITHIEU
            }
            if (referral_code !== user_refferal_code) {
                res.render('signup1', {layout:false, invalidCode: true,isSignUp: false, isSignIn:true})
            }
            // redirect to sign-up 2 page
            else {
                currentUser = student_id
                res.render("signup2",{layout:false, isSignUp: false, isSignIn:true});
            }
        }
    },
    confirm_psw: async (req, res) => {

        const psw = req.body.password
        const re_psw = req.body.retype_password

        if (psw === re_psw) {
            await userDB.addUser(currentUser, psw);
            await userDB.delete_ref_code(currentUser)
            res.redirect("/application/signin")
            // res.render("signin",{layout:false});
        }
        else {
            res.render("signup2",{layout:false, invalid_retype: true, isSignUp: false, isSignIn:true});
        }
    },

    forget_password: async (req, res) => {
        res.render('forgetpass', {layout:false})
    },

    forgetpass_process: async (req, res) => {
        const student_id = req.body.student_id
        const email = req.body.email
        
        // check email existed
        if (await userDB.checkAccount(student_id, email)) {
            // new password = student_id + @123
            const new_password = student_id + "@123"
            // update password
            await userDB.updatePassword(student_id, new_password)
            res.render('forgetpass', {layout:false, new_password: true, isSignUp: false, isSignIn:false})
        }
        else {
            res.render('forgetpass', {layout:false, invalidEmail: true, isSignUp: false, isSignIn:false})
        }
    }

}